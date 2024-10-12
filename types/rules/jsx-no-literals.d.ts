type RawElementConfig = {
  noStrings?: boolean;
  allowedStrings?: string[];
  ignoreProps?: boolean;
  noAttributeStrings?: boolean;
};

type RawOverrideConfig = {
  allowElement?: boolean;
  applyToNestedElements?: boolean;
};

interface RawElementOverrides {
  elementOverrides?: Record<string, RawOverrideConfig>;
}

export type RawConfig = RawElementConfig & RawElementOverrides;

interface ElementConfigType {
  type: 'element';
}

interface ElementConfigProperties {
  noStrings: boolean;
  allowedStrings: Set<string>;
  ignoreProps: boolean;
  noAttributeStrings: boolean;
}

interface OverrideConfigProperties {
  type: 'override';
  name: string;
  allowElement: boolean;
  applyToNestedElements: boolean;
}

export type ElementConfig = {
  type: 'element';
} & ElementConfigProperties;

export type OverrideConfig = OverrideConfigProperties & ElementConfigProperties;

interface ElementOverrides {
  elementOverrides: Record<string, OverrideConfig>;
}

export type Config = ElementConfig & ElementOverrides;

export type ResolvedConfig = Config | OverrideConfig;

