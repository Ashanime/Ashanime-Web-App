import React from "react";

const InstallApp = () => {
  let deferredPrompt;
  const [showInstall, setShowInstall] = React.useState(false);

  const handleInstall = (e) => {
    e.preventDefault();
    setShowInstall(false);
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === "accepted") {
        console.log("User accepted the A2HS prompt");
      } else {
        console.log("User dismissed the A2HS prompt");
      }
      deferredPrompt = null;
    });
  };

  React.useEffect(() => {
    window.addEventListener("beforeinstallprompt", (e) => {
      e.preventDefault();
      deferredPrompt = e;
      setShowInstall(true);
    });
  }, []);

  return (
    <div>
      <h2 onClick={handleInstall}>Install App</h2>
      {showInstall && (
        <div>
          <p>Install this app on your phone</p>
          <button onClick={handleInstall}>Install</button>
        </div>
      )}
    </div>
  );
};

export default InstallApp;
