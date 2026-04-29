// ===============================
// 1. Create or Get Visitor UID
// ===============================
function getOrCreateVisitorUID() {
  const cookieName = "visitor_uid";
 
  let uid = document.cookie
    .split("; ")
    .find(row => row.startsWith(cookieName + "="))
    ?.split("=")[1];
 
  if (!uid) {
    uid = crypto.randomUUID();
 
    // IMPORTANT: Secure added for HTTPS (GitHub Pages)
    document.cookie = `${cookieName}=${uid}; path=/; max-age=31536000; SameSite=Lax; Secure`;
  }
 
  return uid;
}
 
const visitorUID = getOrCreateVisitorUID();
console.log("Visitor UID:", visitorUID);
 
 
// ===============================
// 2. Get GA Client ID (Fixed)
// ===============================
function getGAClientId() {
  const gaCookie = document.cookie
    .split("; ")
    .find(row => row.startsWith("_ga="));
 
  if (!gaCookie) return null;
 
  const value = gaCookie.split("=")[1];
  const parts = value.split(".");
 
  return parts.length >= 4 ? `${parts[2]}.${parts[3]}` : null;
}
 
const gaClientId = getGAClientId();
console.log("GA Client ID:", gaClientId);
 
 
// ===============================
// 3. First-Touch Tracking
// ===============================
function setFirstTouch() {
  if (!localStorage.getItem("first_touch_page")) {
    localStorage.setItem("first_touch_page", window.location.pathname);
  }
}
 
setFirstTouch();
 
 
// ===============================
// 4. Initialize GA (ONLY PLACE)
// ===============================
function initGA() {
  if (typeof gtag !== "function") return;
 
  const storedUserId = localStorage.getItem("linked_user_id");
 
  gtag('config', 'G-6L6S0DHGEE', {
    user_id: storedUserId || undefined,
    user_properties: {
      visitor_uid: visitorUID
    },
    debug_mode: true
  });
}
 
initGA();
 
 
// ===============================
// 5. Track Page Type
// ===============================
function trackPage(pageName) {
  if (typeof gtag !== "function") return;
 
  gtag('event', 'page_type_view', {
    page_type: pageName,
    visitor_uid: visitorUID,
    first_touch_page: localStorage.getItem("first_touch_page"),
    debug_mode: true
  });
}
 
 
// ===============================
// 6. Simulate Signup
// ===============================
function simulateSignup() {
  let existingUserId = localStorage.getItem("linked_user_id");
 
  // ✅ If already signed up, reuse same ID
  if (existingUserId) {
    alert("User already signed up: " + existingUserId);
    return;
  }
 
  // ✅ Create only once
  const userId = "user_" + Math.floor(Math.random() * 100000);
 
  localStorage.setItem("linked_user_id", userId);
 
  if (typeof gtag === "function") {
    gtag('event', 'signup', {
      user_id: userId,
      visitor_uid: visitorUID,
      first_touch_page: localStorage.getItem("first_touch_page"),
      debug_mode: true
    });
 
    gtag('config', 'G-6L6S0DHGEE', {
      user_id: userId,
      user_properties: {
        visitor_uid: visitorUID
      },
      debug_mode: true
    });
  }
 
  alert("Signup successful. User ID: " + userId);
}
