import { useEffect } from "react";

const SITE_NAME = "Judy";

// タブタイトル: トップは「Judy」、それ以外は「XXXX - Judy」
export function usePageTitle(title?: string) {
  useEffect(() => {
    document.title = title ? `${title} - ${SITE_NAME}` : SITE_NAME;
  }, [title]);
}
