// Clixtell requires this bootstrap immediately after <body>, so use a native
// inline script: next/script's beforeInteractive strategy moves it to <head>.
const bootstrap = `
(function () {
  if (document.getElementById('clixtell-tracking-loader')) return;
  var script = document.createElement('script');
  var prefix = document.location.protocol;
  script.id = 'clixtell-tracking-loader';
  script.async = true;
  script.type = 'text/javascript';
  script.src = prefix + '//scripts.clixtell.com/track.js';
  document.head.appendChild(script);
})();
`;

export function ClixtellTracking() {
  return (
    <>
      <script id="clixtell-tracking-init" type="text/javascript" dangerouslySetInnerHTML={{ __html: bootstrap }} />
      <noscript>
        {/* Native tracking pixel must remain available without JavaScript. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="//tracker.clixtell.com/track/t.gif" alt="" width="1" height="1" style={{ display: "none" }} />
      </noscript>
    </>
  );
}
