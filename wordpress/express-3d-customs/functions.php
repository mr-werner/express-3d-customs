<?php
/**
 * Express 3D Customs theme.
 *
 * A block theme built around the e3d-chime-configurator plugin (the Live 3D Cover Designer).
 * Everything on the home page is made of editable blocks; this file only adds the styles,
 * a little front-end script, the [e3d_designer] embed and the Blueprint WebStudio visit counter.
 *
 * @package express-3d-customs
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

define( 'E3D_THEME_VERSION', '1.0.0' );

/** Slug of the page that already holds the designer on the current site. */
define( 'E3D_DESIGNER_PAGE', 'custom-door-chime-cover-designer' );

add_action( 'after_setup_theme', function () {
	add_theme_support( 'wp-block-styles' );
	add_theme_support( 'editor-styles' );
	add_editor_style( 'style.css' );
	add_theme_support( 'woocommerce' );
} );

add_action( 'wp_enqueue_scripts', function () {
	wp_enqueue_style( 'express-3d-customs', get_stylesheet_uri(), array(), E3D_THEME_VERSION );
	wp_enqueue_script( 'express-3d-customs', get_theme_file_uri( 'assets/js/site.js' ), array(), E3D_THEME_VERSION, array( 'strategy' => 'defer', 'in_footer' => true ) );
	wp_localize_script( 'express-3d-customs', 'E3D_THEME', array(
		'designerUrl' => esc_url( home_url( '/' . E3D_DESIGNER_PAGE . '/' ) ),
	) );
} );

/**
 * The plugin's own stylesheet styles body, h1, .hero, .section and more site-wide, which would
 * restyle the whole theme. Swap it for the same rules scoped to the designer
 * (assets/css/designer-plugin-scoped.css, made from plugin v1.0.25).
 */
add_action( 'wp_enqueue_scripts', function () {
	if ( wp_style_is( 'e3d-chime-configurator', 'registered' ) ) {
		$was_enqueued = wp_style_is( 'e3d-chime-configurator', 'enqueued' );
		wp_dequeue_style( 'e3d-chime-configurator' );
		if ( $was_enqueued || ! empty( $GLOBALS['e3d_designer_embedded'] ) ) {
			wp_enqueue_style( 'e3d-designer-scoped', get_theme_file_uri( 'assets/css/designer-plugin-scoped.css' ), array(), E3D_THEME_VERSION );
		}
	}
	// If the designer is embedded on this page but the plugin only queued its script on its own page, queue it here too.
	if ( ! empty( $GLOBALS['e3d_designer_embedded'] ) && wp_script_is( 'e3d-chime-configurator', 'registered' ) && ! wp_script_is( 'e3d-chime-configurator', 'enqueued' ) ) {
		wp_enqueue_script( 'e3d-chime-configurator' );
		wp_enqueue_style( 'e3d-designer-scoped', get_theme_file_uri( 'assets/css/designer-plugin-scoped.css' ), array(), E3D_THEME_VERSION );
	}
}, 100 );

/**
 * [e3d_designer] — shows the Live 3D Cover Designer anywhere.
 *
 * Uses the plugin's own shortcode when it has one of the usual names, otherwise renders the content of
 * the existing designer page (so nothing about the plugin has to change). Attributes:
 *   page="custom-door-chime-cover-designer"   slug of the page that holds the designer
 *   shortcode="your_shortcode"                the plugin's shortcode, if you know it
 */
add_shortcode( 'e3d_designer', function ( $atts ) {
	static $rendering = false;
	if ( $rendering ) {
		return '';
	}
	$atts = shortcode_atts( array( 'page' => E3D_DESIGNER_PAGE, 'shortcode' => '' ), $atts, 'e3d_designer' );

	$GLOBALS['e3d_designer_embedded'] = true;
	$rendering                        = true;
	$html                             = '';

	$candidates = array_filter( array( $atts['shortcode'], 'e3d_chime_configurator', 'e3d-chime-configurator', 'e3d_chime_designer', 'chime_configurator', 'e3d_configurator' ) );
	foreach ( $candidates as $tag ) {
		if ( shortcode_exists( $tag ) ) {
			$html = do_shortcode( '[' . $tag . ']' );
			break;
		}
	}

	if ( '' === trim( $html ) ) {
		$page = get_page_by_path( sanitize_title( $atts['page'] ) );
		if ( $page && 'publish' === $page->post_status ) {
			$html = apply_filters( 'the_content', $page->post_content );
		}
	}
	$rendering = false;

	if ( '' === trim( wp_strip_all_tags( $html, true ) ) && false === strpos( $html, 'e3d-chime-configurator' ) ) {
		$link = esc_url( home_url( '/' . sanitize_title( $atts['page'] ) . '/' ) );
		$html = '<div class="e3d-designer-fallback"><p>Open the Live 3D Cover Designer to build your cover.</p>'
			. '<p><a class="wp-element-button" href="' . $link . '">Open the designer</a></p>'
			. ( current_user_can( 'edit_theme_options' ) ? '<p class="e3d-admin-note">Admin note: the designer plugin wasn\'t found. Check that e3d-chime-configurator is active and the designer page slug is "' . esc_html( $atts['page'] ) . '".</p>' : '' )
			. '</div>';
	}

	return '<div class="e3d-designer-embed">' . $html . '</div>';
} );

/** Block templates don't run shortcodes inside Shortcode blocks, so run them here (needed for [e3d_designer] on the home page). */
add_filter( 'render_block_core/shortcode', function ( $content ) {
	return do_shortcode( $content );
} );

/** Block pattern category for the home page sections. */
add_action( 'init', function () {
	register_block_pattern_category( 'express-3d-customs', array( 'label' => __( 'Express 3D Customs', 'express-3d-customs' ) ) );
} );

/**
 * Visit counter for the Blueprint WebStudio client portal (no cookies, see blueprint-digital api/track.js).
 * Turn it off with: add_filter( 'e3d_portal_tracking', '__return_false' );
 */
add_action( 'wp_head', function () {
	if ( is_admin() || is_user_logged_in() || ! apply_filters( 'e3d_portal_tracking', true ) ) {
		return;
	}
	?>
<script>try{navigator.sendBeacon("https://www.blueprintwebstudio.com/api/track",JSON.stringify({path:location.pathname,referrer:document.referrer}))}catch(e){}</script>
	<?php
} );

/** URL of an image bundled with the theme (used by the patterns). */
function e3d_img( $file ) {
	return esc_url( get_theme_file_uri( 'assets/images/' . $file ) );
}
