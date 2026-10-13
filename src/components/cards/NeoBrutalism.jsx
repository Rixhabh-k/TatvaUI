import "../../styles/cards/neobrutalism.css";

function NeoBrutalism({
  headerText = "NEWS",
  date = "05/11/26",
  title = "SHIP FASTER, LOOK BETTER, EASY CUSTOMIZATION",
  description = "Drop this card into any project and go. Bold by default, customizable in seconds.",
  linkText = "Learn more",

  href = "#",
  to,
  LinkComponent,

  width = "290px",
  height = "auto",
  minHeight = "330px",

  headerColor = "#f078f2",
  cardColor = "#ffffff",
  borderColor = "#171717",
  shadowColor = "#171717",

  headerTextColor = "#000000",
  dateColor = "#737373",
  titleColor = "#171717",
  descriptionColor = "#404040",
  linkColor = "#171717",

  borderWidth = 3,
  shadowOffset = 5,
  hoverOffset = 3,

  className = "",
  ...props
}) {
  const cardStyle = {
    "--tattva-neo-width": width,
    "--tattva-neo-height": height,
    "--tattva-neo-min-height": minHeight,

    "--tattva-neo-header-bg": headerColor,
    "--tattva-neo-card-bg": cardColor,
    "--tattva-neo-border": borderColor,
    "--tattva-neo-shadow": shadowColor,

    "--tattva-neo-header-text": headerTextColor,
    "--tattva-neo-date": dateColor,
    "--tattva-neo-title": titleColor,
    "--tattva-neo-description": descriptionColor,
    "--tattva-neo-link": linkColor,

    "--tattva-neo-border-width": `${borderWidth}px`,
    "--tattva-neo-shadow-offset": `${shadowOffset}px`,
    "--tattva-neo-hover-offset": `${hoverOffset}px`,
  };

  const linkProps = LinkComponent
    ? { to: to ?? href }
    : { href: to ?? href };

  const LinkTag = LinkComponent || "a";

  return (
    <div
      {...props}
      className={`tattva-neobrutalism ${className}`}
      style={{
        ...cardStyle,
        ...props.style,
      }}
    >
      <article className="tattva-neobrutalism__surface">
        <header className="tattva-neobrutalism__header">
          {headerText}
        </header>

        <div className="tattva-neobrutalism__body">
          <time className="tattva-neobrutalism__date">
            {date}
          </time>

          <h2 className="tattva-neobrutalism__title">
            {title}
          </h2>

          <p className="tattva-neobrutalism__description">
            {description}
          </p>

          <LinkTag
            {...linkProps}
            className="tattva-neobrutalism__link"
          >
            <span>{linkText}</span>
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              width="19"
              height="19"
            >
              <path
                d="M5 12h13M12 5l7 7-7 7"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </LinkTag>
        </div>
      </article>
    </div>
  );
}

export default NeoBrutalism;