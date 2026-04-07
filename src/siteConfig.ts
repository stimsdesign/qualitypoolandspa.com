// import { fontProviders } from "astro/config";
/* Icon Imports */
import FacebookIcon from "./icons/facebook.svg"
import InstagramIcon from "./icons/instagram.svg"
import TwitterXIcon from "./icons/twitterx.svg"

const baseUrl = "https://www.qualitypoolandspa.com";

export const siteConfig = {
    url: baseUrl,
    prettyUrl: "qualitypoolandspa.com",
    title: "Quality Pool & Spa",
    titleStinger: "Quality is Our Specialty",
    description: "Quality Pool and Spa is a leader in the premiere pool and spa industry across Salt Lake Valley & Park City.",
    keywords: "Astro, Bootstrap, Starter, Template, Web Design",
    mission: "Quality Pool and Spa is a leader in the premiere pool and spa industry across Salt Lake Valley & Park City.",
    author: "STIMS Design",
    brand: "Quality Pool & Spa",
    company: "Quality Pool & Spa",
    telephone: "+18014741089",
    prettyTelephone: "(801) 474-1089",
    email: "office@qualitypoolandspa.com",
    addressLine1: "2970 S West Temple",
    addressLine2: "Unit A",
    city: "South Salt Lake",
    state: "UT",
    postalCode: "84115",
    country: "USA",
    hoursOfOperation: "Mon-Fri: 9:00AM - 6:00PM",
    hoursOfOperationWeekend: "Sat-Sun: 8:00AM - 4:00PM",
    ogImage: `${baseUrl}/og-image.jpg`, /* Path relative to the public directory */
    socialLinks: [
        { name: 'Facebook', url: 'https://www.facebook.com/Qualitypoolandspaslc/', icon: FacebookIcon },
        { name: 'Instagram', url: 'https://www.instagram.com/qualitypoolandspa/', icon: InstagramIcon },
        { name: 'Twitter/X', url: 'https://twitter.com/qualitypoolslc', icon: TwitterXIcon },
    ],
    messengerId: "Qualitypoolandspaslc",
    // Add other configurable values here
};

export type SiteConfig = typeof siteConfig;