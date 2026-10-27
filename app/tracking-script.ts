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
  var settings = ${settings};
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
  window.gtag('js', new Date());
  window.gtag('config', settings.googleAdsId);

  document.addEventListener('click', function (event) {
    if (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    var target = event.target;
    var link = target && target.closest ? target.closest('a[href]') : null;
    if (!link) return;
    var href = link.getAttribute('href') || '';
    var channel = href.indexOf('tel:') === 0 ? 'phone' : href.indexOf('sms:') === 0 ? 'sms' : null;
    if (!channel) return;
    link.dataset.contactChannel = channel;

    // iOS Messages uses &body; Android and the standards-based fallback use ?body.
    // Preserve custom product/consultation messages and the synchronous user gesture.
    if (channel === 'sms') {
      var isApple = /iPad|iPhone|iPod/.test(navigator.userAgent) ||
        (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
      var match = href.match(/^sms:([^?&]+)[?&]body=(.*)$/);
      if (match) link.setAttribute('href', 'sms:' + match[1] + (isApple ? '&' : '?') + 'body=' + match[2]);
    }

    var label = channel === 'phone' ? settings.phoneConversionLabel : settings.smsConversionLabel;
    if (!label) return;
    try {
      window.gtag('event', 'conversion', {
        send_to: settings.googleAdsId + '/' + label,
        transport_type: 'beacon'
      });
    } catch (_) {
      // Tracking must never prevent the native phone/message action.
    }
  }, true);
})();
`;
}
