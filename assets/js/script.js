
'use strict';

// Element toggle function
const elementToggleFunc = function (elem) {
  elem.classList.toggle("active");
};

// Sidebar
const sidebar = document.querySelector("[data-sidebar]");
const sidebarBtn = document.querySelector("[data-sidebar-btn]");

sidebarBtn.addEventListener("click", function () {
  elementToggleFunc(sidebar);
});

// Contact form
const form = document.querySelector("[data-form]");
const formInputs = document.querySelectorAll("[data-form-input]");
const formBtn = document.querySelector("[data-form-btn]");

for (let i = 0; i < formInputs.length; i++) {
  formInputs[i].addEventListener("input", function () {
    if (form.checkValidity()) {
      formBtn.removeAttribute("disabled");
    } else {
      formBtn.setAttribute("disabled", "");
    }
  });
}

// Page navigation
const navigationLinks = document.querySelectorAll("[data-nav-link]");
const pages = document.querySelectorAll("[data-page]");

for (let i = 0; i < navigationLinks.length; i++) {
  navigationLinks[i].addEventListener("click", function () {
    for (let j = 0; j < pages.length; j++) {
      if (this.innerHTML.toLowerCase() === pages[j].dataset.page) {
        pages[j].classList.add("active");
        navigationLinks[i].classList.add("active");
        window.scrollTo(0, 0);
      } else {
        pages[j].classList.remove("active");
        navigationLinks[i].classList.remove("active");
      }
    }
  });
}


/* =========================================
   PORTFOLIO README VIEWER
========================================= */

// Project repositories
const projects = {
  opamp: {
    readme: "https://raw.githubusercontent.com/afcaff/opamp-amp/main/README.md",
    base: "https://raw.githubusercontent.com/afcaff/opamp-amp/main/",
    github: "https://github.com/afcaff/opamp-amp"
  },

  stm32: {
    readme: "https://raw.githubusercontent.com/afcaff/unit-circle_bldc/main/README.md",
    base: "https://raw.githubusercontent.com/afcaff/unit-circle_bldc/main/",
    github: "https://github.com/afcaff/unit-circle_bldc"
  },

  solar: {
    readme: "https://raw.githubusercontent.com/afcaff/2axis_solar/main/README.md",
    base: "https://raw.githubusercontent.com/afcaff/2axis_solar/main/",
    github: "https://github.com/afcaff/2axis_solar"
  },

  research: {
    readme: "./projects/research.md",
    base: new URL("./projects/", window.location.href).href,
    github: null
  }
};

// HTML elements
const gallery = document.getElementById("project-gallery");
const viewer = document.getElementById("project-viewer");
const readmeContent = document.getElementById("readme-content");
const readmeStatus = document.getElementById("readme-status");
const backButton = document.getElementById("back-to-projects");

// Resolve README images and links
function fixReadmePaths(container, base) {

  // Fix image paths
  container.querySelectorAll("img[src]").forEach(img => {
    const src = img.getAttribute("src");

    if (!src) return;

    try {
      const resolved = new URL(src, base);

      if (["https:", "http:"].includes(resolved.protocol)) {
        img.src = resolved.href;
      } else {
        img.removeAttribute("src");
      }
    } catch {
      img.removeAttribute("src");
    }
  });

  // Fix relative links
  container.querySelectorAll("a[href]").forEach(link => {
    const href = link.getAttribute("href");

    if (!href) return;

    try {
      const resolved = new URL(href, base);

      if (["https:", "http:"].includes(resolved.protocol)) {
        link.href = resolved.href;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
      } else {
        link.removeAttribute("href");
      }
    } catch {
      link.removeAttribute("href");
    }
  });
}

// Open a project README
async function openProject(projectId) {
  const project = projects[projectId];

  if (!project) {
    console.error("Project not found:", projectId);
    return;
  }

  // Switch from gallery to viewer
  gallery.hidden = true;
  viewer.hidden = false;

  readmeContent.replaceChildren();
  readmeStatus.textContent = "Loading README...";

  try {
    // Fetch Markdown
    const response = await fetch(project.readme);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const markdown = await response.text();

    // Convert Markdown to sanitized HTML
    const html = DOMPurify.sanitize(
      marked.parse(markdown)
    );

    readmeContent.innerHTML = html;

    // Fix README image and link paths
    fixReadmePaths(readmeContent, project.base);

    readmeStatus.textContent = "";

    // Add GitHub repository link
    if (project.github) {
      const githubLink = document.createElement("a");

      githubLink.href = project.github;
      githubLink.textContent = "View GitHub Repository ↗";
      githubLink.className = "project-link";
      githubLink.target = "_blank";
      githubLink.rel = "noopener noreferrer";

      readmeContent.appendChild(githubLink);
    }

  } catch (error) {
    console.error("README loading error:", error);
    readmeStatus.textContent =
      "Unable to load project documentation.";
  }

  window.scrollTo(0, 0);
}

// Add click events to all project cards
document.querySelectorAll(".readme-trigger").forEach(card => {
  card.addEventListener("click", function (event) {
    event.preventDefault();
    openProject(this.dataset.project);
  });
});

// Return to project gallery
backButton.addEventListener("click", function () {
  viewer.hidden = true;
  gallery.hidden = false;

  readmeContent.replaceChildren();
  readmeStatus.textContent = "";

  window.scrollTo(0, 0);
});
