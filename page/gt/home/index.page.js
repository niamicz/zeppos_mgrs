import { createWidget, widget, prop, align } from "@zos/ui";
import { geolocation } from "@zos/sensor";
import { toMgrs } from "../../../mgrs";

Page({
  build() {
    const mgrsText = createWidget(widget.TEXT, {
      x: 0,
      y: 200,
      w: 480,
      h: 50,
      text_size: 24,
      align_h: align.CENTER_H,
      align_v: align.CENTER_V,
      color: 0xffffff,
      text: "Locating...",
    });

    function updateLocation() {
      geolocation.getCurrentPosition({
        success(pos) {
          const lat = pos.coords.latitude;
          const lon = pos.coords.longitude;
          const mgrs = toMgrs(lat, lon);
          mgrsText.setProperty(prop.MORE, { text: mgrs });
        },
        fail(err) {
          console.log("Geolocation error:", err);
          mgrsText.setProperty(prop.MORE, { text: "Location error" });
        }
      });
    }

    updateLocation();
    setInterval(updateLocation, 10000); // Update every 10s
  }
});
