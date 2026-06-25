import React, { useState, useEffect } from "react";

type Platform =
  | "youtube"
  | "twitch"
  | "website"
  | "app"
  | "instagram"
  | "facebook";

// Industry average data for niches
const nicheData = {
  youtube: {
    "Finance & Business": { rpm: 12.5 },
    "Tech & Software": { rpm: 7.2 },
    "Education & Tutorials": { rpm: 5.5 },
    "Lifestyle & Vlogs": { rpm: 3.5 },
    Gaming: { rpm: 2.0 },
    "Entertainment & Comedy": { rpm: 1.5 },
  },
  twitch: {
    "Competitive eSports": { rpm: 4.5 },
    "Just Chatting": { rpm: 3.5 },
    "Variety Gaming": { rpm: 2.5 },
    "Music & Art": { rpm: 2.0 },
  },
  website: {
    "Finance & Insurance": { cpc: 2.5, ctr: 2.5 },
    "Technology & Gadgets": { cpc: 1.5, ctr: 1.5 },
    "Health & Fitness": { cpc: 0.8, ctr: 1.2 },
    "News & Entertainment": { cpc: 0.3, ctr: 1.0 },
    "General Blog": { cpc: 0.5, ctr: 1.0 },
  },
  app: {
    "Mid-Core Games": { rpm: 6.0 }, // eCPM
    "Utility & Productivity": { rpm: 4.0 },
    "Hyper-Casual Games": { rpm: 2.0 },
    "Social Networking": { rpm: 1.5 },
  },
  instagram: {
    "In-Feed Posts": { rpm: 1.5 },
    Reels: { rpm: 0.6 },
    Stories: { rpm: 0.8 },
    "Fashion & Lifestyle": { rpm: 1.2 },
  },
  facebook: {
    "In-Stream Video": { rpm: 2.5 },
    Reels: { rpm: 0.8 },
    "Instant Articles": { rpm: 1.2 },
    "General Entertainment": { rpm: 1.0 },
  },
};

interface CalculatorProps {
  initialPlatform?: Platform;
}

export default function Calculator({
  initialPlatform = "youtube",
}: CalculatorProps) {
  // We use initialPlatform from Astro URL routing to set the active tab
  const platform = initialPlatform;

  const platformNiches = Object.keys(nicheData[platform]);

  // Input states
  const [category, setCategory] = useState<string>(platformNiches[0]);

  // Platform-specific traffic states
  const [traffic, setTraffic] = useState<number>(100000); // Used by YouTube, Website, Instagram, Facebook
  const [viewers, setViewers] = useState<number>(1000); // Used by Twitch
  const [hoursStreamed, setHoursStreamed] = useState<number>(100); // Used by Twitch
  const [dau, setDau] = useState<number>(10000); // Used by App/Game
  const [adsPerDay, setAdsPerDay] = useState<number>(3); // Used by App/Game

  // Rate states
  const [cpc, setCpc] = useState<number>(
    nicheData.website[platformNiches[0] as keyof typeof nicheData.website]
      ?.cpc || 0,
  );
  const [ctr, setCtr] = useState<number>(
    nicheData.website[platformNiches[0] as keyof typeof nicheData.website]
      ?.ctr || 0,
  );
  const rpmSource =
    platform === "website" ? nicheData.youtube : nicheData[platform];

  const [rpm, setRpm] = useState(Object.values(rpmSource)[0]?.rpm ?? 0);

  // Result state
  const [totalEarnings, setTotalEarnings] = useState<number>(0);

  // Update RPM/CPC when Category changes
  useEffect(() => {
    if (platform === "website") {
      const data =
        nicheData.website[category as keyof typeof nicheData.website];
      if (data) {
        setCpc(data.cpc);
        setCtr(data.ctr);
      }
    } else {
      // @ts-ignore - dynamic indexing
      const data = nicheData[platform][category];
      if (data) setRpm(data.rpm);
    }
  }, [category, platform]);

  // Math Logic Calculation
  useEffect(() => {
    let revenue = 0;

    if (platform === "website") {
      // Google AdSense Formula: Total Pageviews * (CTR / 100) * CPC
      const clicks = traffic * (ctr / 100);
      revenue = clicks * cpc;
    } else if (platform === "twitch") {
      // Twitch Formula: (Avg Viewers * Hours Streamed * Assumed 3 ad breaks/hr / 1000) * RPM
      const monthlyImpressions = viewers * hoursStreamed * 3;
      revenue = (monthlyImpressions / 1000) * rpm;
    } else if (platform === "app") {
      // App Formula: (DAU * Ads per day * 30 days / 1000) * eCPM
      const monthlyImpressions = dau * adsPerDay * 30;
      revenue = (monthlyImpressions / 1000) * rpm;
    } else {
      // YouTube/FB/Insta Formula: (Total Views / 1000) * RPM
      revenue = (traffic / 1000) * rpm;
    }

    setTotalEarnings(revenue);
  }, [
    platform,
    traffic,
    viewers,
    hoursStreamed,
    dau,
    adsPerDay,
    cpc,
    ctr,
    rpm,
  ]);

  // UI Helpers
  const formatCurrency = (num: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(num);
  };

  const formatTraffic = (num: number) => {
    if (num >= 1000000)
      return (num / 1000000).toFixed(1).replace(/\.0$/, "") + "M";
    if (num >= 1000) return (num / 1000).toFixed(1).replace(/\.0$/, "") + "K";
    return num.toString();
  };

  const platforms = [
    {
      id: "youtube",
      label: "YouTube",
      url: "/youtube-ad-revenue-calculator",
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
          <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
        </svg>
      ),
    },

    {
      id: "instagram",
      label: "Instagram",
      url: "/instagram-ad-revenue-calculator",
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-5 h-5"
        >
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
        </svg>
      ),
    },
    {
      id: "facebook",
      label: "Facebook",
      url: "/facebook-ad-revenue-calculator",
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
          <path d="M22.675 0h-21.35C.597 0 0 .597 0 1.325v21.351C0 23.403.597 24 1.325 24H12.82v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116c.73 0 1.323-.597 1.323-1.325V1.325C24 .597 23.403 0 22.675 0z" />
        </svg>
      ),
    },

    {
      id: "website",
      label: "Website",
      url: "/website-ad-revenue-calculator",
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-5 h-5"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
          <path d="M2 12h20" />
        </svg>
      ),
    },
    {
      id: "twitch",
      label: "Twitch",
      url: "/twitch-ad-revenue-calculator",
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
          <path d="M2.149 0l-1.612 4.119v16.836h5.731v3.045h3.224l3.045-3.045h4.657l6.806-6.806v-14.149h-21.851zm19.344 13.134l-4.119 4.119h-5.373l-3.045 3.045v-3.045h-4.836v-15.045h17.373v10.926zm-8.06-6.268h-2.507v4.836h2.507v-4.836zm5.015 0h-2.507v4.836h2.507v-4.836z" />
        </svg>
      ),
    },
    {
      id: "app",
      label: "App/Game",
      url: "/app-ad-revenue-calculator",
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-5 h-5"
        >
          <rect x="2" y="6" width="20" height="12" rx="2" />
          <line x1="6" y1="12" x2="10" y2="12" />
          <line x1="8" y1="10" x2="8" y2="14" />
          <line x1="15" y1="13" x2="15.01" y2="13" />
          <line x1="18" y1="11" x2="18.01" y2="11" />
        </svg>
      ),
    },
  ];

  return (
    <div className="w-full max-w-6xl mx-auto bg-canvas rounded-2xl shadow-sm border border-hairline overflow-hidden flex flex-col lg:flex-row">
      {/* LEFT SIDE: Inputs & Controls */}
      <div className="w-full lg:w-1/2 p-6 md:p-10 bg-canvas border-b lg:border-b-0 lg:border-r border-hairline">
        {/* URL-Routing Platform Tabs */}
        <div className="mb-8">
          <label className="block text-sm font-semibold text-mute mb-3 uppercase tracking-wider">
            Select Platform
          </label>
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
            {platforms.map((p) => (
              <a
                key={p.id}
                href={p.url}
                className={`py-3 px-1 flex flex-col items-center justify-center gap-1.5 text-xs sm:text-sm font-medium rounded-lg transition-all duration-200 ${
                  platform === p.id
                    ? "bg-primary text-on-primary shadow-md cursor-default"
                    : "bg-canvas-soft text-body hover:bg-hairline cursor-pointer"
                }`}
              >
                {p.icon}
                <span className="truncate w-full text-center">{p.label}</span>
              </a>
            ))}
          </div>
        </div>

        {/* Dynamic Inputs */}
        <div className="space-y-6">
          {/* Niche Selection */}
          <div>
            <label className="block text-sm font-semibold text-ink mb-2">
              Content Category / Niche
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-3 bg-canvas-soft border border-hairline rounded-lg text-ink focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer appearance-none"
            >
              {platformNiches.map((niche) => (
                <option key={niche} value={niche}>
                  {niche}
                </option>
              ))}
            </select>
          </div>

          {/* Platform Specific Inputs */}
          {(platform === "youtube" ||
            platform === "website" ||
            platform === "instagram" ||
            platform === "facebook") && (
            <div>
              <label className="flex justify-between text-sm font-semibold text-ink mb-2">
                <span>
                  {platform === "youtube" && "Total Video Views"}
                  {platform === "website" && "Monthly Page Views"}
                  {platform === "instagram" && "Reel Plays / Impressions"}
                  {platform === "facebook" && "Video Views"}
                </span>
                <span className="text-primary font-bold">
                  {formatTraffic(traffic)}
                </span>
              </label>
              <input
                type="range"
                min="1000"
                max="10000000"
                step="1000"
                value={traffic}
                onChange={(e) => setTraffic(Number(e.target.value))}
                className="w-full h-2 bg-hairline rounded-lg appearance-none cursor-pointer accent-primary"
              />
              <input
                type="number"
                value={traffic}
                onChange={(e) => setTraffic(Number(e.target.value))}
                className="mt-3 w-full p-3 bg-canvas-soft border border-hairline rounded-lg text-ink focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              />
            </div>
          )}

          {platform === "twitch" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-ink mb-2">
                  Avg Concurrent Viewers
                </label>
                <input
                  type="number"
                  value={viewers}
                  onChange={(e) => setViewers(Number(e.target.value))}
                  className="w-full p-3 bg-canvas-soft border border-hairline rounded-lg text-ink focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-ink mb-2">
                  Hours Streamed (Monthly)
                </label>
                <input
                  type="number"
                  value={hoursStreamed}
                  onChange={(e) => setHoursStreamed(Number(e.target.value))}
                  className="w-full p-3 bg-canvas-soft border border-hairline rounded-lg text-ink focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <p className="text-xs text-mute sm:col-span-2">
                Calculation assumes an average of 3 ad breaks per hour.
              </p>
            </div>
          )}

          {platform === "app" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-ink mb-2">
                  DAU
                </label>
                <input
                  type="number"
                  value={dau}
                  onChange={(e) => setDau(Number(e.target.value))}
                  className="w-full p-3 bg-canvas-soft border border-hairline rounded-lg text-ink focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <p className="text-xs text-mute mt-1">Daily Active Users</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-ink mb-2">
                  Ads per Day
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={adsPerDay}
                  onChange={(e) => setAdsPerDay(Number(e.target.value))}
                  className="w-full p-3 bg-canvas-soft border border-hairline rounded-lg text-ink focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <p className="text-xs text-mute mt-1">Average per user</p>
              </div>
            </div>
          )}

          {/* Website Specific Inputs (CTR & CPC) */}
          {platform === "website" && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-ink mb-2">
                  Avg. CTR (%)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.1"
                    value={ctr}
                    onChange={(e) => setCtr(Number(e.target.value))}
                    className="w-full p-3 pl-4 pr-8 bg-canvas-soft border border-hairline rounded-lg text-ink focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <span className="absolute right-3 top-3 text-mute">%</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-ink mb-2">
                  Avg. CPC ($)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-mute">$</span>
                  <input
                    type="number"
                    step="0.01"
                    value={cpc}
                    onChange={(e) => setCpc(Number(e.target.value))}
                    className="w-full p-3 pl-8 bg-canvas-soft border border-hairline rounded-lg text-ink focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
            </div>
          )}

          {/* YouTube/FB/Insta/Twitch/App Specific Input (RPM/CPM) */}
          {platform !== "website" && (
            <div>
              <label className="block text-sm font-semibold text-ink mb-2">
                {platform === "youtube" || platform === "twitch"
                  ? "RPM"
                  : "eCPM"}{" "}
                (Revenue per 1k views)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-3 text-mute">$</span>
                <input
                  type="number"
                  step="0.1"
                  value={rpm}
                  onChange={(e) => setRpm(Number(e.target.value))}
                  className="w-full p-3 pl-8 bg-canvas-soft border border-hairline rounded-lg text-ink focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                />
              </div>
              <p className="text-xs text-mute mt-2">
                You can manually override the{" "}
                {platform === "youtube" || platform === "twitch"
                  ? "RPM"
                  : "eCPM"}{" "}
                above if you know your exact metric.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* RIGHT SIDE: Results */}
      <div className="w-full lg:w-1/2 p-6 md:p-10 bg-canvas-soft-2 flex flex-col justify-center items-center text-center">
        <h3 className="text-xl font-bold text-ink mb-2">
          {["youtube", "facebook", "instagram"].includes(platform)
            ? "Estimated One-time Earnings"
            : "Estimated Monthly Earnings"}
        </h3>
        <p className="text-sm text-mute mb-8">
          Based on your exact inputs and niche averages
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-1 gap-4 w-full">
          {/* Conservative Estimate (-25%) */}
          <div className="w-full bg-canvas p-4 md:p-6 rounded-xl border border-hairline shadow-sm relative overflow-hidden flex flex-col justify-center">
            <div className="absolute top-0 left-0 w-full h-1 bg-warning"></div>
            <p className="text-xs text-mute font-bold uppercase tracking-wider mb-2">
              Conservative
            </p>
            <p className="text-xl md:text-2xl font-bold text-ink tracking-tight">
              {formatCurrency(totalEarnings * 0.75)}
            </p>
          </div>

          {/* Expected Estimate (Base) */}
          <div className="w-full bg-canvas p-4 md:p-6 rounded-xl border-2 border-primary shadow-md relative overflow-hidden scale-100 sm:scale-105 z-10 flex flex-col justify-center">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-gradient-develop-start to-gradient-preview-end"></div>
            <p className="text-xs text-mute font-bold uppercase tracking-wider mb-2">
              Expected
            </p>
            <p className="text-2xl md:text-4xl font-extrabold text-ink tracking-tight">
              {formatCurrency(totalEarnings)}
            </p>
          </div>

          {/* Optimistic Estimate (+35%) */}
          <div className="w-full bg-canvas p-4 md:p-6 rounded-xl border border-hairline shadow-sm relative overflow-hidden flex flex-col justify-center">
            <div className="absolute top-0 left-0 w-full h-1 bg-success"></div>
            <p className="text-xs text-mute font-bold uppercase tracking-wider mb-2">
              Optimistic
            </p>
            <p className="text-xl md:text-2xl font-bold text-ink tracking-tight">
              {formatCurrency(totalEarnings * 1.35)}
            </p>
          </div>
        </div>

        {platform === "website" && (
          <div className="mt-8 flex gap-6 text-sm text-mute">
            <p>
              Estimated Clicks:{" "}
              <strong className="text-ink">
                {Math.round(traffic * (ctr / 100)).toLocaleString()}
              </strong>
            </p>
          </div>
        )}

        <div className="mt-8 p-4 bg-warning-soft text-warning-deep text-xs rounded-lg text-left w-full border border-warning">
          <strong>Note:</strong> This is a calculation for the exact metrics
          provided. Actual ad revenue fluctuates daily based on advertiser
          demand, user geography, ad blockers, and seasonal trends.
        </div>
      </div>
    </div>
  );
}
