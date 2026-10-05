/**
 * Props exposed by the {@link Img} component.
 */
export type ImgProps = {
  /**
   * Path or URL of the image.
   */
  src: string;

  /**
   * Alternative text announced by assistive technologies in place of the
   * image ([WCAG 1.1.1](https://www.w3.org/WAI/WCAG22/Understanding/non-text-content)).
   * Describe what the image conveys. Use an empty string (`alt=""`) only for
   * decorative images, which assistive technologies then ignore.
   */
  alt: string;

  /**
   * Width of the image, in pixels. Shrinks to fit the available width when
   * it's larger (e.g. inside a narrow `UColumn`).
   */
  width?: number;

  /**
   * Height of the image, in pixels.
   */
  height?: number;

  /**
   * Proportion between width and height (e.g. `16 / 9`), used to reserve the
   * image's space before it loads. Ignored when `height` is set.
   */
  aspectRatio?: number;

  /**
   * Fills the image's area, cropping the image when its proportion differs
   * from the area's. By default, the whole image is shown inside the area.
   * @default false
   */
  cover?: boolean;

  /**
   * Loads the image right away, instead of when it's about to become
   * visible. Use it for images visible when the page opens, such as a logo.
   * @default false
   */
  eager?: boolean;

  /**
   * Component id to use on automated tests.
   */
  dataTestid?: string;
};
