# Vertical Logo Marquee

A responsive, infinite-scrolling vertical logo marquee component for your portfolio website. This component displays technology logos in two vertical tracks that scroll in opposite directions, creating a dynamic and engaging visual element.

## Features

- Two vertical tracks with logos scrolling in opposite directions
- Responsive design that adapts to different screen sizes
- Smooth animations with CSS transitions
- Hover effects that pause scrolling and highlight logos
- Grayscale effect on logos that colorizes on hover
- Automatic animation speed adjustment based on screen size
- Clean, modular code structure

## Files

- `marquee.html` - HTML structure for the marquee component
- `marquee.css` - Styling for the marquee component
- `marquee.js` - JavaScript for infinite scrolling and interaction
- `index.html` - Demo page showing the marquee in action
- `integration.html` - Instructions for integrating into your portfolio
- `README.md` - This documentation file

## How to Use

1. Include the CSS in your HTML head:
   ```html
   <link rel="stylesheet" href="marquee/marquee.css">
   ```

2. Add the HTML where you want the marquee to appear:
   ```html
   <div id="marquee-container"></div>
   ```

3. Include the JavaScript before the closing body tag:
   ```html
   <script src="marquee/marquee.js"></script>
   <script>
       document.addEventListener('DOMContentLoaded', function() {
           const marqueeContainer = document.getElementById('marquee-container');
           
           // Fetch and insert the marquee HTML
           fetch('marquee/marquee.html')
               .then(response => response.text())
               .then(html => {
                   marqueeContainer.innerHTML = html;
                   
                   // Re-initialize the marquee after loading
                   initMarquee('.marquee-track.downward');
                   initMarquee('.marquee-track.upward');
                   setupHoverPause();
               })
               .catch(error => {
                   console.error('Error loading marquee:', error);
               });
       });
   </script>
   ```

## Customization

### Changing Logos

Edit the `marquee.html` file to change which logos are displayed. The component uses logos from the `../tool-logos/` directory.

### Styling

The component uses CSS variables for easy theming. You can override these variables in your main CSS file:

```css
:root {
    --bg-subtle: #f5f5f5;      /* Background color */
    --bg-card: #ffffff;        /* Logo card background */
    --space-sm: 0.5rem;        /* Small spacing */
    --space-md: 1rem;          /* Medium spacing */
    --space-lg: 1.5rem;        /* Large spacing */
    --space-xl: 2rem;          /* Extra large spacing */
    --radius-md: 0.5rem;       /* Border radius */
}
```

### Animation Speed

You can adjust the base animation speed in the `marquee.js` file by modifying the `baseDuration` variable in the `adjustAnimationDuration` function.

## Browser Compatibility

This component works in all modern browsers that support CSS animations and JavaScript ES6 features.
