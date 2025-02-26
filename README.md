# Portfolio Website

A personal portfolio website showcasing my projects, skills, and services.

## Project Structure

```
portfolio/
├── assets/
│   ├── images/         # Images used throughout the site
│   └── logos/          # Technology logos for the marquee component
├── components/
│   └── marquee/        # Reusable logo marquee component
│       ├── index.html  # Component HTML structure
│       ├── marquee.css # Component styles
│       ├── marquee.js  # Component functionality
├── css/
│   └── styles.css      # Main stylesheet
├── js/
│   └── main.js         # Main JavaScript file
├── demo/               # Text extraction demo project (separate git repository)
└── index.html          # Main HTML file
```

## Features

- Responsive design
- Dark/light theme toggle
- Interactive project showcase
- Skills marquee with technology logos
- Contact form
- Testimonials section

## Running the Project

To run the portfolio website:

```bash
python serve_portfolio.py
```

This will start a local server at http://localhost:8000
