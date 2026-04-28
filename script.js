// 1. Create or get Visitor UID
function getOrCreateVisitorUID() {
  const cookieName = "visitor_uid";
 
  let uid = document.cookie
    .split("; ")
    .find(row => row.startsWith(cookieName + "="))
    ?.split("=")[1];
 
  if (!uid) {
    uid = crypto.randomUUID();
    document.cookie = `${cookieName}=${uid}; path=/; max-age=31536000; SameSite=Lax`;
  }
 
  return uid;
}
 
const visitorUID = getOrCreateVisitorUID();
console.log("Visitor UID:", visitorUID);
 
 
// 2. Get GA Client ID
function getGAClientId() {
  const gaCookie = document.cookie
    .split("; ")
    .find(row => row.startsWith("_ga="));
 
  if (!gaCookie) return null;
 
  const parts = gaCookie.split('.');
  return parts.length >= 4 ? `${parts[2]}.${parts[3]}` : null;
}
 
const gaClientId = getGAClientId();
console.log("GA Client ID:", gaClientId);
 
 
// 3. Send data to Google Analytics
// (IMPORTANT: ensure gtag exists before calling it)
if (typeof gtag === "function") {
 
  // Send custom event
  gtag('event', 'page_view_with_uid', {
    visitor_uid: visitorUID
  });
 
  // Attach as user property
  gtag('config', 'G-6L6S0DHGEE', {
    user_properties: {
      visitor_uid: visitorUID
    }
  });
 
}
