const blogList = document.getElementById('blog-list');
const blogEmpty = document.getElementById('blog-empty');
const postsSource = 'blog/posts.txt';

const fallbackPosts = [
  {
    title: 'Why independent authors should own their workflow',
    slug: 'own-your-workflow',
    date: 'July 31, 2026',
    snippet: 'Your writing tool should protect your voice, your privacy, and your ability to ship marketing-ready posts without subscription lock-in.',
    category: 'Market & Writing'
  }
];

function renderPostCard(post) {
  return `
    <article class="blog-card">
      <div class="blog-card-meta">${post.date} · ${post.category || 'Blog'}</div>
      <h3>${post.title}</h3>
      <p class="blog-card-snippet">${post.snippet}</p>
      <a href="blog/${post.slug}.html">Read full article</a>
    </article>`;
}

function showPosts(posts) {
  if (!posts || !posts.length) {
    if (blogEmpty) blogEmpty.hidden = false;
    return;
  }
  const sorted = posts.slice().sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    if (!isNaN(dateA) && !isNaN(dateB)) return dateB - dateA;
    return 0;
  });
  blogList.innerHTML = sorted.map(renderPostCard).join('');
  if (blogEmpty) blogEmpty.hidden = true;
}

fetch(postsSource)
  .then(response => {
    if (!response.ok) throw new Error('Unable to load blog posts.');
    return response.text();
  })
  .then(text => {
    const posts = text
      .split(/\r?\n/)
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .map(line => {
        try {
          return JSON.parse(line);
        } catch (err) {
          console.warn('Skipping invalid blog post line:', line);
          return null;
        }
      })
      .filter(Boolean);
    if (posts.length === 0) throw new Error('No valid blog posts found.');
    showPosts(posts);
  })
  .catch(() => {
    if (blogList) blogList.innerHTML = fallbackPosts.map(renderPostCard).join('');
    if (blogEmpty) blogEmpty.hidden = true;
  });
