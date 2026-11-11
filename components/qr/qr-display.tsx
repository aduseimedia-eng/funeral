"use client";
import { useEffect, useState } from "react";
import QRCode from "qrcode";
export function useQr(value: string) {
  const [url, setUrl] = useState("");
  useEffect(() => {
    let active = true;
    QRCode.toDataURL(value, {
      width: 600,
      margin: 2,
      color: { dark: "#2c382aff", light: "#ffffffff" },
      errorCorrectionLevel: "M",
    }).then((u) => {
      if (active) setUrl(u);
    });
    return () => {
      active = false;
    };
  }, [value]);
  return url;
}
export function campaignUrl(id: string) {
  return `${typeof window !== "undefined" ? window.location.origin : ""}/memorial/?id=${id}`;
}
export function QRCodeDisplay({ value }: { value: string }) {
  const url = useQr(value);
  return (
    <div className="qr-display">
      {url ? (
        <img src={url} alt="QR code linking to the memorial page" />
      ) : (
        <div className="spinner" />
      )}
      <p>Scan to open this memorial</p>
    </div>
  );
}
