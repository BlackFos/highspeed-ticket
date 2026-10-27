export type TrackingConfig = {
  googleAdsId: string;
  phoneConversionLabel: string;
  smsConversionLabel: string;
};

// Shared by all five independent sites. No conversion is sent without a real label.
export function createTrackingScript(config: TrackingConfig) {
  const settings = JSON.stringify(config).replace(/</g, "\\u003c");
  return `
(function () {
  if (window.__contactTrackingInstalled) return;
  window.__contactTrackingInstalled = true;
  window.__contactTrackingVersion = '2026-10-27.2';
  var settings = ${settings};
  var pendingLinks = new WeakSet();
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
  window.gtag('js', new Date());
  window.gtag('config', settings.googleAdsId);

  document.addEventListener('click', function (event) {
    if (event.defaultPrevented || event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    var target = event.target;
    var link = target && target.closest ? target.closest('a[href]') : null;
    if (!link) return;
    var href = link.getAttribute('href') || '';
    var channel = href.indexOf('tel:') === 0 ? 'phone' : href.indexOf('sms:') === 0 ? 'sms' : null;
    if (!channel) return;
    link.dataset.contactChannel = channel;

    // iOS Messages uses &body; Android and the standards-based fallback use ?body.
    // Preserve the exact recipient and encoded custom message.
    if (channel === 'sms') {
      var isApple = /iPad|iPhone|iPod/.test(navigator.userAgent) ||
        (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
      var match = href.match(/^sms:([^?&]+)[?&]body=(.*)$/);
      if (match) {
        href = 'sms:' + match[1] + (isApple ? '&' : '?') + 'body=' + match[2];
        link.setAttribute('href', href);
      }
    }

    var label = channel === 'phone' ? settings.phoneConversionLabel : settings.smsConversionLabel;
    if (!label) return;

    // A native SMS/call chooser can suspend the page before gtag's queue runs.
    // Follow Google's click snippet: finish processing before leaving the page.
    // The independent 1s fallback also covers an unloaded/blocked Google tag.
    event.preventDefault();
    if (pendingLinks.has(link)) return;
    pendingLinks.add(link);
    var navigated = false;
    var fallback;
    function openContact() {
      if (navigated) return;
      navigated = true;
      pendingLinks.delete(link);
      window.clearTimeout(fallback);
      window.location.assign(href);
    }
    fallback = window.setTimeout(openContact, 1000);
    try {
      window.gtag('event', 'conversion', {
        send_to: settings.googleAdsId + '/' + label,
        transport_type: 'beacon',
        event_callback: openContact,
        event_timeout: 900
      });
    } catch (_) {
      openContact();
    }
  }, true);
})();
`;
}
