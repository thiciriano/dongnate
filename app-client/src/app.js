import "./styles/index.css";
import { registerSW } from "virtual:pwa-register";

// Registra o Service Worker para permitir instalação como App (PWA)
registerSW({ immediate: true });

import api from "./services/api.js";
import { Header, updateHeaderNotifications } from "./components/Header.js";
import { Footer } from "./components/Footer.js";
import { BottomNav } from "./components/BottomNav.js";
import { LandingPage } from "./screens/LandingPage.js";
import { LoginScreen } from "./screens/LoginScreen.js";
import { RegisterScreen } from "./screens/RegisterScreen.js";
import { RegisterOngScreen } from "./screens/RegisterOngScreen.js";
import { HomeScreen } from "./screens/HomeScreen.js";
import { RequestDetailScreen } from "./screens/RequestDetailScreen.js";
import { MapScreen } from "./screens/MapScreen.js";
import { ProfileScreen } from "./screens/ProfileScreen.js";
import { EditProfileScreen } from "./screens/EditProfileScreen.js";
import { MyRequestsScreen } from "./screens/MyRequestsScreen.js";
import { MyInterestsScreen } from "./screens/MyInterestsScreen.js";
import { CreateRequestScreen } from "./screens/CreateRequestScreen.js";
import { SuccessScreen } from "./screens/SuccessScreen.js";
import { TermsScreen } from "./screens/TermsScreen.js";
import { PrivacyScreen } from "./screens/PrivacyScreen.js";
import { HowItWorksScreen } from "./screens/HowItWorksScreen.js";
import { AboutScreen } from "./screens/AboutScreen.js";

const app = document.getElementById("app");

const routes = {
  "/": HomeScreen,
  "/landing": LandingPage,
  "/login": LoginScreen,
  "/register": RegisterScreen,
  "/register-ong": RegisterOngScreen,
  "/request-detail": RequestDetailScreen,
  "/map": MapScreen,
  "/profile": ProfileScreen,
  "/edit-profile": EditProfileScreen,
  "/my-requests": MyRequestsScreen,
  "/my-interests": MyInterestsScreen,
  "/create-request": CreateRequestScreen,
  "/success": SuccessScreen,
  "/terms": TermsScreen,
  "/privacy": PrivacyScreen,
  "/how-it-works": HowItWorksScreen,
  "/about": AboutScreen,
};

export async function router() {
  // Exporta a função router
  const path = window.location.pathname;
  const user = JSON.parse(localStorage.getItem("user"));

  let targetPath = path;

  if (!user) {
    if (path === "/") targetPath = "/landing";
    else if (
      ![
        "/login",
        "/register",
        "/landing",
        "/terms",
        "/privacy",
        "/how-it-works",
        "/about",
      ].includes(path)
    ) {
      window.history.pushState({}, "", "/landing");
      return router();
    }
  } else {
    if (["/login", "/register", "/landing"].includes(path)) {
      window.history.pushState({}, "", "/");
      return router();
    }
  }

  let component = routes[targetPath];
  let params = {};

  if (targetPath.startsWith("/request-detail/")) {
    component = RequestDetailScreen;
    params.id = targetPath.split("/").pop();
  }

  if (!component) component = user ? HomeScreen : LandingPage;

  const showNav =
    user && !["/login", "/register", "/register-ong"].includes(targetPath);
  const isFullPage = [
    "/landing",
    "/login",
    "/register",
    "/register-ong",
    "/success",
  ].includes(targetPath);

  app.innerHTML = `
        ${!isFullPage ? Header() : ""}
        <main id="main-content" class="flex-1 ${showNav ? "pb-24" : ""}"></main>
        ${showNav ? BottomNav() : ""}
        ${!isFullPage ? Footer() : ""}
    `;

  const mainContent = document.getElementById("main-content");
  await component(mainContent, params);

  if (user) {
    updateHeaderNotifications();

    // Evento do Sino
    const bell = document.getElementById("notif-bell-container");
    if (bell) {
      bell.onclick = (e) => {
        e.stopPropagation();
        document.getElementById("notif-dropdown").classList.toggle("hidden");
      };
    }
  }
}

// Global Click Listener para SPA e Ações Especiais (Logout)
document.addEventListener("click", (e) => {
  // Links SPA
  const link = e.target.closest("[data-link]");
  if (link) {
    e.preventDefault();
    const href = link.getAttribute("href");
    window.history.pushState({}, "", href);
    router();
    return;
  }

  // Botões de Sair (Header ou Perfil)
  const logoutBtn = e.target.closest("#logout-btn, #logout-profile-btn");
  if (logoutBtn) {
    e.preventDefault();
    api.auth.logout();
    window.history.pushState({}, "", "/landing");
    router();
  }
});

window.onpopstate = router;
window.onclick = () => {
  const dropdown = document.getElementById("notif-dropdown");
  if (dropdown) dropdown.classList.add("hidden");
};

document.addEventListener("DOMContentLoaded", router);
