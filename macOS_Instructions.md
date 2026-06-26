Double-click .zip → macOS Archive Utility extracts DraftwellPro.app to the same folder.

  The chmod problem
  Before the app runs, they must open Terminal and run:
  chmod +x DraftwellPro.app/Contents/MacOS/DraftwellPro
  Average users won't know how to do this. It's a real friction point — the zip format doesn't carry Unix execute permissions from Windows.

  Gatekeeper block
  Since the app isn't code-signed, macOS will refuse to open it with: "DraftwellPro cannot be opened because it is from an unidentified developer."
  Workaround: right-click → Open → Open. Only needed once.

  After that
  Drag to Applications, double-click. The .app bundle launches the binary silently (no terminal window), server starts, Chrome opens to the app. Normal Mac behavior.
