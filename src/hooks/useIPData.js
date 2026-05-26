import { useState, useEffect } from "react";

export function useIPData() {
  const [ipData, setIpData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchIP() {
      setLoading(true);
      setError(null);

      // Primary: ipapi.co
      try {
        const res = await fetch("https://ipapi.co/json/");
        const data = await res.json();
        if (data.error) throw new Error("ipapi.co rate limited");
        setIpData({
          ip: data.ip,
          city: data.city,
          region: data.region,
          country_name: data.country_name,
          country_code: data.country_code,
          latitude: data.latitude,
          longitude: data.longitude,
          timezone: data.timezone,
          utc_offset: data.utc_offset,
          org: data.org,
          asn: data.asn,
          currency: data.currency,
          currency_name: data.currency_name,
          languages: data.languages,
          calling_code: data.country_calling_code,
        });
        setLoading(false);
        return;
      } catch {
        console.warn("ipapi.co failed, trying fallback...");
      }

      // Fallback 1: ip-api.com
      try {
        const res = await fetch("http://ip-api.com/json/");
        const data = await res.json();
        if (data.status === "fail") throw new Error("ip-api.com failed");
        setIpData({
          ip: data.query,
          city: data.city,
          region: data.regionName,
          country_name: data.country,
          country_code: data.countryCode,
          latitude: data.lat,
          longitude: data.lon,
          timezone: data.timezone,
          utc_offset: null,
          org: data.org || data.isp,
          asn: data.as,
          currency: null,
          currency_name: null,
          languages: null,
          calling_code: null,
        });
        setLoading(false);
        return;
      } catch {
        console.warn("ip-api.com failed, trying ipwhois...");
      }

      // Fallback 2: ipwhois.app (HTTPS, no key)
      try {
        const res = await fetch("https://ipwhois.app/json/");
        const data = await res.json();
        setIpData({
          ip: data.ip,
          city: data.city,
          region: data.region,
          country_name: data.country,
          country_code: data.country_code,
          latitude: data.latitude,
          longitude: data.longitude,
          timezone: data.timezone,
          utc_offset: data.utc_offset,
          org: data.org,
          asn: data.asn,
          currency: data.currency,
          currency_name: data.currency_plural,
          languages: data.languages,
          calling_code: data.calling_code,
        });
        setLoading(false);
      } catch (err) {
        console.error("All IP APIs failed:", err);
        setError("Could not retrieve IP data");
        setLoading(false);
      }
    }

    fetchIP();
  }, []);

  return { ipData, loading, error };
}
