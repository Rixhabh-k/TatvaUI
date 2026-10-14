import { useId, useState } from "react";
import "../../styles/cards/showcard.css";

const DEFAULT_TAGS = ["React.js", "SCSS", "CSS"];
const DEFAULT_IMAGE = "https://i.pinimg.com/736x/e9/f5/3b/e9f53bfb32d1fb4964e8c722847f0c54.jpg";

const DEFAULT_DESCRIPTION =
  "Tatva UI is a modern React animation library designed to bring interfaces to life through expressive motion, interactive components, and thoughtful design. I built a cohesive collection of animations focused on fluidity, precision, and creative freedom. The goal is to help developers craft digital experiences that feel dynamic, intuitive, and purposeful—where every interaction has meaning and every detail matters.";

/** target="_blank" ke saath rel automatically safe set hota hai */
const relFor = (target) => (target === "_blank" ? "noopener noreferrer" : undefined);

function ChevronIcon() {
  return (
    <svg
      className="tattva-show-card__chevron"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

/**
 * ShowCard
 *
 * Content
 * @param {string}  [props.image]             Image URL. Na dene par default gradient dikhta hai
 * @param {string}  [props.imageAlt]          Image alt text (default: title)
 * @param {string}  [props.title="Adella AI"]
 * @param {string}  [props.subtitle="Product Design"]
 * @param {string}  [props.heading]           Expanded panel ka heading
 * @param {Array<string|{label:string, href?:string, target?:string}>} [props.tags]
 * @param {string}  [props.description]
 * @param {React.ReactNode} [props.children]  Dene par default details ki jagah ye render hota hai
 *
 * Links
 * @param {string}  [props.imageHref]         Dene par poori image clickable ho jati hai
 * @param {string}  [props.imageTarget]       "_blank", "_self", etc.
 * @param {boolean} [props.showPreview=true]  Preview button dikhana hai ya nahi
 * @param {string}  [props.previewLabel="Preview Project"]
 * @param {string}  [props.previewHref]       Dene par button link ban jata hai
 * @param {string}  [props.previewTarget="_blank"]
 * @param {Function} [props.onPreview]        previewHref na ho to click handler
 *
 * Colors (sab optional, CSS color value)
 * @param {string}  [props.cardColor]         Main card background
 * @param {string}  [props.panelColor]        Expanded panel background
 * @param {string}  [props.textColor]         Heading + chevron color
 * @param {string}  [props.mutedTextColor]    Description + toggle label color
 * @param {string}  [props.titleColor]        Image par title color
 * @param {string}  [props.subtitleColor]     Image par subtitle color
 * @param {string}  [props.tagColor]          Tag background
 * @param {string}  [props.tagTextColor]      Tag text color
 *
 * State
 * @param {string}  [props.openLabel="View"]
 * @param {string}  [props.closeLabel="Close"]
 * @param {boolean} [props.defaultOpen=false] Uncontrolled initial state
 * @param {boolean} [props.open]              Controlled state
 * @param {(next:boolean)=>void} [props.onToggle]
 *
 * Layout
 * @param {string}  [props.className]         Positioning / spacing ke liye apni class
 * @param {object}  [props.style]
 */
function ShowCard({
  image=DEFAULT_IMAGE,
  imageAlt,
  title = "Tatva UI",
  subtitle = "Design Library",
  heading = "The Philosophy Behind Tatva UI.",
  tags = DEFAULT_TAGS,
  description = DEFAULT_DESCRIPTION,
  children,

  imageHref,
  imageTarget,
  showPreview = true,
  previewLabel = "Preview Project",
  previewHref,
  previewTarget = "_blank",
  onPreview,

  cardColor,
  panelColor,
  textColor,
  mutedTextColor,
  titleColor,
  subtitleColor,
  tagColor,
  tagTextColor,

  openLabel = "View",
  closeLabel = "Close",
  defaultOpen = false,
  open,
  onToggle,

  className = "",
  style,
  ...props
}) {
  const panelId = useId();
  const [internalOpen, setInternalOpen] = useState(defaultOpen);

  const isControlled = open !== undefined;
  const isOpen = isControlled ? open : internalOpen;

  const handleToggle = () => {
    const next = !isOpen;
    if (!isControlled) setInternalOpen(next);
    onToggle?.(next);
  };

  const toggleLabel = isOpen ? closeLabel : openLabel;

  // CSS variables sirf tab set hote hain jab user ne prop diya ho,
  // taaki baaki sab user ki stylesheet se bhi override ho sake.
  const colorVars = {
    "--tattva-sc-bg": cardColor,
    "--tattva-sc-panel-bg": panelColor,
    "--tattva-sc-text": textColor,
    "--tattva-sc-muted": mutedTextColor,
    "--tattva-sc-title": titleColor,
    "--tattva-sc-subtitle": subtitleColor,
    "--tattva-sc-chip-bg": tagColor,
    "--tattva-sc-chip-text": tagTextColor,
  };
  const inlineVars = Object.fromEntries(
    Object.entries(colorVars).filter(([, value]) => value !== undefined)
  );

  return (
    <div
      {...props}
      data-open={isOpen}
      className={`tattva-show-card ${className}`.trim()}
      style={{ ...inlineVars, ...style }}
    >
      {/* ---------- Image ---------- */}
      <div className="tattva-show-card__media">
        {image ? (
          <img
            className="tattva-show-card__image"
            src={image}
            alt={imageAlt ?? title}
            loading="lazy"
            draggable={false}
          />
        ) : (
          <div className="tattva-show-card__placeholder" />
        )}

        {imageHref && (
          <a
            className="tattva-show-card__image-link"
            href={imageHref}
            target={imageTarget}
            rel={relFor(imageTarget)}
            aria-label={title}
          />
        )}

        <div className="tattva-show-card__caption">
          {title && <p className="tattva-show-card__title">{title}</p>}
          {subtitle && <p className="tattva-show-card__subtitle">{subtitle}</p>}
        </div>

        {showPreview &&
          (previewHref ? (
            <a
              className="tattva-show-card__preview"
              href={previewHref}
              target={previewTarget}
              rel={relFor(previewTarget)}
            >
              {previewLabel}
            </a>
          ) : (
            <button
              type="button"
              className="tattva-show-card__preview"
              onClick={onPreview}
            >
              {previewLabel}
            </button>
          ))}
      </div>

      {/* ---------- Expandable panel ---------- */}
      <div className="tattva-show-card__panel" id={panelId}>
        <div className="tattva-show-card__panel-inner">
          {children ?? (
            <div className="tattva-show-card__details">
              {heading && (
                <h3 className="tattva-show-card__heading">{heading}</h3>
              )}

              {tags?.length > 0 && (
                <ul className="tattva-show-card__tags">
                  {tags.map((tag, index) => {
                    const item = typeof tag === "string" ? { label: tag } : tag;
                    return (
                      <li key={`${item.label}-${index}`}>
                        {item.href ? (
                          <a
                            className="tattva-show-card__tag"
                            href={item.href}
                            target={item.target}
                            rel={relFor(item.target)}
                          >
                            {item.label}
                          </a>
                        ) : (
                          <span className="tattva-show-card__tag">
                            {item.label}
                          </span>
                        )}
                      </li>
                    );
                  })}
                </ul>
              )}

              {description && (
                <>
                  <hr className="tattva-show-card__divider" />
                  <p className="tattva-show-card__description">{description}</p>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ---------- Toggle ---------- */}
      <button
        type="button"
        className="tattva-show-card__toggle"
        onClick={handleToggle}
        aria-expanded={isOpen}
        aria-controls={panelId}
        aria-label={toggleLabel}
      >
        <ChevronIcon />
        <span className="tattva-show-card__toggle-label">{toggleLabel}</span>
      </button>
    </div>
  );
}

export default ShowCard;

/* ---------------- Usage ----------------

// Default data ke saath
<ShowCard />

// Apna data + colors + positioning
<ShowCard
  className="my-project-card"
  image="/projects/nova.jpg"
  title="Nova CRM"
  subtitle="Web App"
  imageHref="https://example.com/nova"
  previewHref="https://example.com/nova"
  heading="How Nova CRM came together"
  tags={["Nova Labs", "6 Weeks", { label: "React", href: "https://react.dev" }]}
  description="Short story about the project..."
  cardColor="#0f172a"
  panelColor="#1e293b"
  textColor="#f8fafc"
  mutedTextColor="#94a3b8"
  tagColor="#334155"
  tagTextColor="#e2e8f0"
/>

// CSS: card ko page me kahin bhi place karo
.my-project-card {
  margin: 0 auto;           // center
  // ya: position: absolute; top: 40px; right: 24px;
}

------------------------------------------ */