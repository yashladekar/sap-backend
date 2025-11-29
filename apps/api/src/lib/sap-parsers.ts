// apps/api/src/lib/sap-parsers.ts

/**
 * Parses SAP support package string like "SAPK-75005INSAPBASIS"
 * Returns: { release: "750", spLevel: 5, component: "SAP_BASIS" }
 */
export function parseSupportPackage(sp: string) {
    // Example formats:
    // SAPK-75005INSAPBASIS
    // SAPK-61716INSAPHR
    const regex = /^SAPK-(\d{3})(\d{2})IN([A-Z0-9_]+)$/;

    const match = sp.match(regex);
    if (!match) {
        return null;
    }

    const release = match[1]; // "750"
    const spLevel = parseInt(match[2]!, 10); // "05" -> 5
    const component = match[3]; // "SAPBASIS" or "SAPHR"

    // Normalize component naming if you want, e.g. SAPBASIS -> SAP_BASIS
    const normalizedComponent = component && component.startsWith("SAP")
        ? `SAP_${component.slice(3)}`
        : component;

    return {
        release,
        spLevel,
        component: normalizedComponent,
    };
}
