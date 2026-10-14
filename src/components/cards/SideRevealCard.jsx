import { useId, useState } from "react";
import "../../styles/cards/siderevealcard.css";

const DEFAULT_IMAGE = "https://i.pinimg.com/1200x/2e/93/02/2e9302acb2ea4f0e5eb53b90e8db4ceb.jpg";
const DEFAULT_DESCRIPTION =
  "I'm focused on growing my brand, improving my products, and finding smarter ways to market and package my work. I'm driven, curious, and committed to turning my design skills into something bigger.";

  

function ArrowIcon({ direction = "right", className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {direction === "right" ? (
        <path d="M5 12h14M13 6l6 6-6 6" />
      ) : (
        <path d="M19 12H5M11 6l-6 6 6 6" />
      )}
    </svg>
  );
}

function QuoteIcon({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z" />
    </svg>
  );
}

/**
 * SideRevealCard
 *
 * Content
 * @param {string}  [props.image]          Background image URL (default: gradient)
 * @param {string}  [props.imageAlt]       Alt text (default: title)
 * @param {string}  [props.thumbnail]      Card 2 ki chhoti image (default: same as image)
 * @param {string}  [props.title="Takahashi Aya"]
 * @param {string}  [props.subtitle="(CEO, Pentaclay)"]
 * @param {string}  [props.description]    Card 2 ka text
 * @param {React.ReactNode} [props.children]  Dene par description ki jagah ye render hota hai
 *
 * Card 1 colors (optional, CSS color)
 * @param {string}  [props.titleColor]
 * @param {string}  [props.subtitleColor]
 * @param {string}  [props.arrowColor]       Arrow circle ka initial color
 * @param {string}  [props.arrowHoverColor]  Arrow circle ka hover color
 * @param {string}  [props.arrowIconColor]
 *
 * Card 2 colors (optional, CSS color)
 * @param {string}  [props.backColor]            Card 2 background
 * @param {string}  [props.descriptionColor]
 * @param {string}  [props.backTitleColor]
 * @param {string}  [props.backSubtitleColor]
 * @param {string}  [props.backArrowColor]
 * @param {string}  [props.backArrowIconColor]
 * @param {string}  [props.quoteColor]
 *
 * State
 * @param {boolean} [props.defaultOpen=false]  Uncontrolled initial state
 * @param {boolean} [props.open]               Controlled state
 * @param {(next:boolean)=>void} [props.onToggle]
 * @param {string}  [props.openLabel="Show details"]  Arrow button ka aria-label
 * @param {string}  [props.closeLabel="Go back"]
 *
 * Layout
 * @param {string}  [props.className]   Positioning / spacing ke liye apni class
 * @param {object}  [props.style]
 */
function SideRevealCard({
  image = DEFAULT_IMAGE,
  imageAlt,
  thumbnail,
  title = "Takahashi Aya",
  subtitle = "(CEO, Pentaclay)",
  description = DEFAULT_DESCRIPTION,
  children,

  titleColor,
  subtitleColor,
  arrowColor,
  arrowHoverColor,
  arrowIconColor,

  backColor,
  descriptionColor,
  backTitleColor,
  backSubtitleColor,
  backArrowColor,
  backArrowIconColor,
  quoteColor,

  defaultOpen = false,
  open,
  onToggle,
  openLabel = "Show details",
  closeLabel = "Go back",

  className = "",
  style,
  ...props
}) {
  const backId = useId();
  const [internalOpen, setInternalOpen] = useState(defaultOpen);

  const isControlled = open !== undefined;
  const isOpen = isControlled ? open : internalOpen;

  const setOpen = (next) => {
    if (!isControlled) setInternalOpen(next);
    onToggle?.(next);
  };

  // CSS variables sirf tab set hote hain jab user ne prop diya ho,
  // taaki baaki sab user ki stylesheet se bhi override ho sake.
  const colorVars = {
    "--tattva-sr-title": titleColor,
    "--tattva-sr-subtitle": subtitleColor,
    "--tattva-sr-arrow-bg": arrowColor,
    "--tattva-sr-arrow-hover-bg": arrowHoverColor,
    "--tattva-sr-arrow-icon": arrowIconColor,
    "--tattva-sr-back-bg": backColor,
    "--tattva-sr-description": descriptionColor,
    "--tattva-sr-back-title": backTitleColor,
    "--tattva-sr-back-subtitle": backSubtitleColor,
    "--tattva-sr-back-arrow-bg": backArrowColor,
    "--tattva-sr-back-arrow-icon": backArrowIconColor,
    "--tattva-sr-quote": quoteColor,
  };
  const inlineVars = Object.fromEntries(
    Object.entries(colorVars).filter(([, value]) => value !== undefined)
  );

  const thumbSrc = thumbnail ?? image;

  return (
    <div
      {...props}
      data-open={isOpen}
      className={`tattva-side-reveal-card ${className}`.trim()}
      style={{ ...inlineVars, ...style }}
    >
      <div className="tattva-side-reveal-card__track">
        {/* ---------- Card 1 (front) ---------- */}
        <div className="tattva-side-reveal-card__face tattva-side-reveal-card__front">
          {image ? (
            <img
              className="tattva-side-reveal-card__image"
              src={image}
              alt={imageAlt ?? title}
              loading="lazy"
              draggable={false}
            />
          ) : (
            <div className="tattva-side-reveal-card__placeholder" />
          )}

          <div className="tattva-side-reveal-card__overlay" />

          <button
            type="button"
            className="tattva-side-reveal-card__arrow"
            onClick={() => setOpen(true)}
            aria-label={openLabel}
            aria-expanded={isOpen}
            aria-controls={backId}
          >
            <ArrowIcon
              direction="right"
              className="tattva-side-reveal-card__arrow-icon"
            />
          </button>

          <div className="tattva-side-reveal-card__caption">
            {title && <p className="tattva-side-reveal-card__title">{title}</p>}
            {subtitle && (
              <p className="tattva-side-reveal-card__subtitle">{subtitle}</p>
            )}
          </div>
        </div>

        {/* ---------- Card 2 (back) ---------- */}
        <div
          className="tattva-side-reveal-card__face tattva-side-reveal-card__back"
          id={backId}
        >
          <div className="tattva-side-reveal-card__back-top">
            <button
              type="button"
              className="tattva-side-reveal-card__back-arrow"
              onClick={() => setOpen(false)}
              aria-label={closeLabel}
            >
              <ArrowIcon
                direction="left"
                className="tattva-side-reveal-card__arrow-icon"
              />
            </button>
            <QuoteIcon className="tattva-side-reveal-card__quote" />
          </div>

          {children ?? (
            <p className="tattva-side-reveal-card__description">{description}</p>
          )}

          <div className="tattva-side-reveal-card__back-footer">
            {thumbSrc ? (
              <img
                className="tattva-side-reveal-card__thumb"
                src={thumbSrc}
                alt=""
                loading="lazy"
                draggable={false}
              />
            ) : (
              <div className="tattva-side-reveal-card__thumb tattva-side-reveal-card__thumb--placeholder" />
            )}

            <div className="tattva-side-reveal-card__back-text">
              {title && (
                <p className="tattva-side-reveal-card__back-title">{title}</p>
              )}
              {subtitle && (
                <p className="tattva-side-reveal-card__back-subtitle">
                  {subtitle}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SideRevealCard;

/* ---------------- Usage ----------------

// Default data ke saath
<SideRevealCard />

// Apna data + colors + positioning
<SideRevealCard
  className="team-card"
  image="/team/aya.jpg"
  title="Aya Takahashi"
  subtitle="(Founder, Studio)"
  description="Short bio goes here..."
  arrowColor="#ffffff"
  arrowHoverColor="#facc15"
  titleColor="#ffffff"
  subtitleColor="#d1d5db"
  backColor="#fef3c7"
  descriptionColor="#374151"
  backTitleColor="#111827"
  backSubtitleColor="#111827"
/>

// CSS
.team-card { margin: 0 auto; }

------------------------------------------ */