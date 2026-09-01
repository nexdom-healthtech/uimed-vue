export type RuleResult = true | string;

export type Rule = ((v: string) => RuleResult) | ((v: string) => PromiseLike<RuleResult>);
