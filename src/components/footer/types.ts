/**
 * Props of the footer shown by the {@link Main} component.
 */
export type FooterProps = {
  /**
   * Text shown in the footer, e.g. the application version ("Versão 1.4.2").
   * The footer is hidden when it's empty or omitted.
   */
  description?: string;

  /**
   * Component id to use on automated tests.
   */
  dataTestid?: string;
};
