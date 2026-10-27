=== Express 3D Customs ===
Contributors: blueprintwebstudio
Requires at least: 6.5
Tested up to: 7.1
Requires PHP: 7.4
Stable tag: 1.0.0
License: GPLv2 or later
License URI: https://www.gnu.org/licenses/gpl-2.0.html

Block theme for Express 3D Customs, built around the Live 3D Cover Designer.

== Installing ==

1. Back up the site (most hosts have a one-click backup).
2. In WordPress, go to Appearance > Themes > Add New Theme > Upload Theme.
3. Choose express-3d-customs.zip, click Install Now, then Activate.
4. Keep the e3d-chime-configurator plugin active and keep the
   "Custom Door Chime Cover Designer" page published at
   /custom-door-chime-cover-designer/. The home page shows that designer.

To go back, activate your previous theme under Appearance > Themes. Nothing
in your pages, products or plugins is changed by this theme.

== Editing ==

Go to Appearance > Editor.

* Templates > Front Page is the home page. Every section (hero, designer,
  patterns, colors, measuring, how it works, reviews, more builds, about,
  FAQ, call to action) is made of normal blocks: click any text, image or
  button to change it.
* Patterns > Express 3D Customs has each section on its own, so a section
  can be added again to any page or put back after it is deleted.
* Styles changes colors and fonts for the whole site.
* Patterns > Header / Footer changes the menu and footer links.

== The designer ==

The [e3d_designer] shortcode shows the designer anywhere. It uses the
plugin's own shortcode if it has a known name, otherwise it shows the
content of the designer page. Options:

  [e3d_designer page="custom-door-chime-cover-designer"]
  [e3d_designer shortcode="your_plugin_shortcode"]

The plugin's stylesheet is swapped for a copy whose rules only apply inside
the designer, so it does not restyle the rest of the site.

== Visit counter ==

The theme sends one anonymous page-view count (no cookies) to the Blueprint
WebStudio client portal, skipped for logged-in users. To turn it off, add
this to a small plugin or a code snippet:

  add_filter( 'e3d_portal_tracking', '__return_false' );

== Credits ==

Chakra Petch and Figtree fonts: SIL Open Font License 1.1.
Photos and logos: Express 3D Customs.
