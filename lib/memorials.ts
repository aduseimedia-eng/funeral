import { Campaign } from "./types";

export function isPublicMemorial(campaign: Campaign) {
  return campaign.status === "Active" || campaign.status === "Completed";
}

export function validateMemorial(campaign: Campaign): string {
  if (!campaign.name.trim() || !campaign.organiser.trim())
    return "Add a name and family organiser.";
  const years = campaign.years.match(/^(\d{4})\s*[–—-]\s*(\d{4})$/);
  if (
    !years ||
    Number(years[1]) > Number(years[2]) ||
    Number(years[2]) > new Date().getFullYear()
  )
    return "Enter valid years of life, for example 1948 — 2026.";
  if (
    !campaign.date ||
    Number.isNaN(Date.parse(campaign.date)) ||
    Number(campaign.date.slice(0, 4)) < Number(years[2])
  )
    return "Choose a funeral date on or after the year of passing.";
  if (!campaign.venue.trim() || !campaign.location.trim())
    return "Add the funeral venue and town.";
  if (
    !Number.isFinite(campaign.target) ||
    campaign.target < 1 ||
    campaign.target > 10000000
  )
    return "Choose a fundraising target between GHS 1 and GHS 10,000,000.";
  if (campaign.obituary.trim().length < 20)
    return "Tell their story in at least 20 characters.";
  if (campaign.description.trim().length < 10)
    return "Add a family message of at least 10 characters.";
  return "";
}
