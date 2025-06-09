import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from "react";
import { bus, useIframeManager } from "@dimple-smile/mframe"; // Assuming this import works

import type { CSSProperties } from "react"; // Use React's CSSProperties

// --- Define Prop Types ---
interface LayoutContainerProps {
  type: "mainApp" | "microApp";
  clearBackgroundStyles?: CSSProperties;
  microAppsContainerStyle?: CSSProperties;
  onLayoutMounted?: (domRefs: {
    // Callback instead of emit
    navDom?: HTMLElement | null;
    menuDom?: HTMLElement | null;
    tabDom?: HTMLElement | null;
    mountDom?: HTMLElement | null;
  }) => void;
}

// --- Define Bus Data Structure (approximate based on usage) ---
interface ContainerBusData {
  microApps?: any[];
  navVisible?: boolean;
  menuVisible?: boolean;
  tabVisible?: boolean;
  mountVisible?: boolean;
  frameVisible?: boolean; // Added based on || logic
  visible?: boolean; // Added based on || logic
  navRect?: { x: number; y: number; width: number; height: number };
  menuRect?: { x: number; y: number; width: number; height: number };
  tabRect?: { x: number; y: number; width: number; height: number };
  mountRect?: { x: number; y: number; width: number; height: number }; // Assuming mountRect might exist too
  activeMicroAppName?: string;
  microAppStickStatus?: boolean;
  // Add other potential fields used by the bus
}

// --- The React Component ---
const LayoutContainer: React.FC<LayoutContainerProps> = ({
  type,
  clearBackgroundStyles = {},
  microAppsContainerStyle = {},
  onLayoutMounted,
}) => {
  // --- State and Refs ---
  const [containerData, setContainerData] = useState<ContainerBusData>(() =>
    bus("container").data.get()
  );
  const [microAppContainerLoading, setMicroAppContainerLoading] =
    useState(false);
  const mouseEventPoint = useRef({ x: -1, y: -1 }); // Use useRef for non-rendering state

  // DOM Refs
  const layoutDomRefs = {
    nav: useRef<HTMLDivElement>(null),
    menu: useRef<HTMLElement>(null), // <aside> maps to HTMLElement
    tab: useRef<HTMLDivElement>(null),
    mount: useRef<HTMLElement>(null), // <section> maps to HTMLElement
  };
  const teleportDomRefs = {
    nav: useRef<HTMLDivElement>(null),
    menu: useRef<HTMLDivElement>(null),
    tab: useRef<HTMLDivElement>(null),
    mount: useRef<HTMLDivElement>(null),
  };
  const microAppContainerRef = useRef<HTMLDivElement>(null);

  // --- Bus Instances ---
  // Assuming bus() returns a stable instance or manages instances internally
  const containerBus = useMemo(() => bus("container"), []);
  const mainAppBus = useMemo(() => bus("mainApp"), []);
  const microAppBus = useMemo(() => bus("microApp"), []);

  // --- Derived State (useMemo) ---
  const isMainApp = useMemo(() => type === "mainApp", [type]);
  const isMicroApp = useMemo(() => type === "microApp", [type]);

  const microApps = useMemo<any[]>(
    () => containerData.microApps || [],
    [containerData.microApps]
  );
  const activeMicroAppName = useMemo(
    () => containerData.activeMicroAppName || "",
    [containerData.activeMicroAppName]
  );

  const visibles = useMemo(() => {
    const fallbackVisible =
      containerData.frameVisible ?? containerData.visible ?? true;
    return {
      nav: containerData.navVisible ?? fallbackVisible,
      menu: containerData.menuVisible ?? fallbackVisible,
      tab: containerData.tabVisible ?? fallbackVisible,
      mount: containerData.mountVisible ?? containerData.visible ?? true, // mount uses slightly different logic
    };
  }, [
    containerData.navVisible,
    containerData.menuVisible,
    containerData.tabVisible,
    containerData.mountVisible,
    containerData.frameVisible,
    containerData.visible,
  ]);

  const placeholderStyle = useMemo(() => {
    return {
      navHeight: `${containerData?.navRect?.height || 0}px`,
      menuWidth: `${containerData?.menuRect?.width || 0}px`,
      tabHeight: `${containerData?.tabRect?.height || 0}px`,
    };
  }, [containerData?.navRect, containerData?.menuRect, containerData?.tabRect]);

  const finalContainerStyle = useMemo<CSSProperties>(
    () => ({
      position: "relative",
      height: "100%",
      display: "flex",
      flexDirection: "column",
    }),
    []
  );

  const mountStyle = useMemo<CSSProperties>(() => {
    const baseStyles = isMicroApp ? clearBackgroundStyles : {};
    return {
      ...baseStyles,
      flex: 1,
      minHeight: 0,
      display: visibles.mount ? "block" : "none", // Handle v-show
      // Add other static styles from the template if needed
    };
  }, [isMicroApp, clearBackgroundStyles, visibles.mount]);

  const finalMicroAppsContainerStyle = useMemo<CSSProperties>(() => {
    let resStyle: CSSProperties = {
      ...(microAppsContainerStyle || {}),
      display: microApps?.length && activeMicroAppName ? "block" : "none",
      position: "absolute",
      zIndex: microAppContainerLoading ? -1 : 1,
      top: 0,
      left: 0,
      height: "100%",
      width: "100%",
      pointerEvents: "none", // Default
    };
    if (isMainApp && containerData.microAppStickStatus && activeMicroAppName) {
      resStyle.pointerEvents = "all";
    }
    return resStyle;
  }, [
    microAppsContainerStyle,
    microApps?.length,
    activeMicroAppName,
    microAppContainerLoading,
    isMainApp,
    containerData.microAppStickStatus,
  ]);

  // --- Event Handlers and Logic ---

  // useCallback to memoize the function if passed down or used in useEffect deps
  const checkLayoutHasUsefulDom = useCallback(
    (targetEl: Element | null): Element | null => {
      if (!targetEl) return null;

      function getDomElementInRect(
        checkEl: Element,
        step = 10
      ): Element | null {
        if (!checkEl) return null;
        const rect = checkEl.getBoundingClientRect();
        const { x, y, width, height } = rect;
        const startX = x;
        const startY = y;
        const endX = x + width;
        const endY = y + height;

        // Get current refs
        const navEl = layoutDomRefs.nav.current;
        const menuEl = layoutDomRefs.menu.current;
        const tabEl = layoutDomRefs.tab.current;
        const mountEl = teleportDomRefs.mount.current; // Use teleport ref for mount content check

        const excludeList = [
          document.documentElement,
          document.body,
          checkEl, // Exclude the container itself
          navEl,
          menuEl,
          tabEl,
          mountEl,
        ].filter((el) => el !== null) as Element[]; // Filter out nulls

        for (let currentX = startX; currentX <= endX; currentX += step) {
          for (let currentY = startY; currentY <= endY; currentY += step) {
            const element = document.elementFromPoint(currentX, currentY);
            // Check if element exists and is not in the exclusion list or a child of an excluded element
            if (
              element &&
              !excludeList.some(
                (excluded) => excluded === element || excluded.contains(element)
              )
            ) {
              return element;
            }
          }
        }
        return null;
      }

      let res = getDomElementInRect(layoutDomRefs.nav.current!); // Check nav container
      if (!res) res = getDomElementInRect(layoutDomRefs.tab.current!); // Check tab container
      if (!res) res = getDomElementInRect(layoutDomRefs.menu.current!); // Check menu container

      // If checking the mount area itself, find elements *inside* its content area
      if (targetEl === layoutDomRefs.mount.current) {
        res = getDomElementInRect(teleportDomRefs.mount.current!);
      }

      return res;
    },
    [
      layoutDomRefs.nav,
      layoutDomRefs.menu,
      layoutDomRefs.tab,
      layoutDomRefs.mount,
      teleportDomRefs.mount,
    ]
  ); // Dependency on refs (stable)

  const handleMouseEvent = useCallback(
    (
      eventType: "mouseenter" | "mouseleave" | "mousemove",
      event: React.MouseEvent<HTMLElement>, // Use React's MouseEvent type
      target: "nav" | "menu" | "tab" | "mount"
    ) => {
      // Debounce based on coordinates
      if (
        mouseEventPoint.current.x === event.clientX &&
        mouseEventPoint.current.y === event.clientY
      )
        return;
      mouseEventPoint.current = { x: event.clientX, y: event.clientY };

      const targetElement = layoutDomRefs[target]?.current; // Get the element being hovered/moved over
      const hasUsefulDom = checkLayoutHasUsefulDom(targetElement);
      const shouldStick = target === "mount" && !hasUsefulDom; // Stick only if over mount *and* no other useful DOM found there

      if (eventType === "mouseenter" || eventType === "mousemove") {
        // Combine logic as it's similar
        if (isMainApp) {
          if (!activeMicroAppName) {
            if (containerData.microAppStickStatus !== false) {
              // Prevent unnecessary sets
              containerBus.data.set({ microAppStickStatus: false });
            }
            return;
          }
          const newStatus = target === "mount"; // Simplified: stick if over mount
          if (containerData.microAppStickStatus !== newStatus) {
            // Prevent unnecessary sets
            containerBus.data.set({ microAppStickStatus: newStatus });
          }
        } else if (isMicroApp) {
          // Send true if useful DOM is found anywhere *within* the layout parts, otherwise stick based on mount hover
          const newStatus = hasUsefulDom ? true : target === "mount";
          // Consider sending only if status changes to avoid flooding
          microAppBus.cors.send("microAppStickStatus", newStatus);
        }
      }
      // Note: mouseleave logic wasn't present in the original for setting stick status
    },
    [
      isMainApp,
      isMicroApp,
      activeMicroAppName,
      containerBus,
      microAppBus,
      checkLayoutHasUsefulDom,
      layoutDomRefs,
      containerData.microAppStickStatus,
    ]
  ); // Add refs and stick status to deps

  // --- Effects (useEffect) ---

  // Watch activeMicroAppName for loading indicator
  useEffect(() => {
    if (!activeMicroAppName) return; // Don't trigger on initial empty or clear
    setMicroAppContainerLoading(true);
    const timer = setTimeout(() => {
      setMicroAppContainerLoading(false);
    }, 300);
    return () => clearTimeout(timer); // Cleanup timeout
  }, [activeMicroAppName]);

  // Subscribe to containerBus data changes
  useEffect(() => {
    const handleDataChange = (newData: ContainerBusData) => {
      setContainerData(newData);
    };
    // Assume watch returns an unwatch function or similar
    const unwatch = containerBus.data.watch(handleDataChange);
    return () => {
      if (typeof unwatch === "function") {
        unwatch(); // Cleanup subscription
      }
    };
  }, [containerBus]); // Run only once on mount/unmount

  // Main App Specific Logic
  useEffect(() => {
    if (!isMainApp) return;

    let observers: MutationObserver[] = [];
    let corsUnlisteners: Function[] = [];

    const setupMainApp = async () => {
      // Wait for DOM refs to be available (simple check, might need refinement)
      // A better way might involve a state variable set when all refs are confirmed non-null
      await Promise.all(
        Object.values(layoutDomRefs).map(
          (ref) =>
            new Promise<void>((resolve) => {
              const check = () =>
                ref.current ? resolve() : requestAnimationFrame(check);
              check();
            })
        )
      );
      await Promise.all(
        Object.values(teleportDomRefs).map(
          (ref) =>
            new Promise<void>((resolve) => {
              const check = () =>
                ref.current ? resolve() : requestAnimationFrame(check);
              check();
            })
        )
      );

      // Setup MutationObservers
      Object.keys(layoutDomRefs).forEach((key) => {
        const type = key as keyof typeof layoutDomRefs;
        const dom = layoutDomRefs[type]?.current;
        if (!dom) return;

        const handleChange = () => {
          const rect = dom?.getBoundingClientRect();
          if (rect) {
            const { x, y, width, height } = rect;
            // Avoid excessive updates if rect hasn't changed significantly
            const currentRect = containerData[
              `${type}Rect` as keyof ContainerBusData
            ] as any;
            if (
              !currentRect ||
              currentRect.x !== x ||
              currentRect.y !== y ||
              currentRect.width !== width ||
              currentRect.height !== height
            ) {
              containerBus.data.set({
                [`${type}Rect`]: { x, y, width, height },
              });
            }
          }
        };
        handleChange(); // Initial call
        const observer = new MutationObserver(handleChange);
        observer.observe(dom, {
          childList: true, // Watch for added/removed children
          subtree: true, // Watch descendants
          attributes: true, // Watch for style/class changes affecting size
          characterData: false, // Less likely needed
        });
        observers.push(observer);
      });

      // Emit layoutMounted event
      containerBus.event.emit("onLayoutMounted");
      if (onLayoutMounted) {
        onLayoutMounted({
          navDom: teleportDomRefs.nav.current,
          menuDom: teleportDomRefs.menu.current,
          tabDom: teleportDomRefs.tab.current,
          mountDom: teleportDomRefs.mount.current,
        });
      }

      // Watch containerBus data changes and send to active microApp
      const layoutDataKeys = containerBus.expose?.getLayoutDataKeys() || []; // Handle expose might not exist
      const unwatchLayout = containerBus.data.watch(() => {
        const currentActiveApp = containerBus.data.get([
          "activeMicroAppName",
        ])?.activeMicroAppName;
        if (!currentActiveApp) return;
        const layoutData = containerBus.data.get(layoutDataKeys);
        mainAppBus.cors.send(currentActiveApp, "layoutDataChange", layoutData);
      }, layoutDataKeys);

      // Listen for microAppStickStatus from microApps
      const unlistenStickStatus = mainAppBus.cors.on(
        "microAppStickStatus",
        (e: any) => {
          if (containerData.microAppStickStatus !== e.data) {
            containerBus.data.set({ microAppStickStatus: e.data });
          }
        }
      );

      // Add cleanup functions
      if (typeof unwatchLayout === "function")
        corsUnlisteners.push(unwatchLayout);
      if (typeof unlistenStickStatus === "function")
        corsUnlisteners.push(unlistenStickStatus);
    };

    setupMainApp();

    // Cleanup function
    return () => {
      observers.forEach((obs) => obs.disconnect());
      corsUnlisteners.forEach((unlisten) => unlisten());
    };
  }, [
    isMainApp,
    containerBus,
    mainAppBus,
    onLayoutMounted,
    layoutDomRefs,
    teleportDomRefs,
    containerData,
  ]); // Ensure necessary dependencies

  // Iframe Manager Mount Dom Effect (Main App Only)
  const { setIframeMountDom } = useIframeManager(); // Get the function
  useEffect(() => {
    if (isMainApp && microAppContainerRef.current) {
      setIframeMountDom(microAppContainerRef.current);
      // Optional cleanup if setIframeMountDom needs it
      // return () => setIframeMountDom(null);
    }
  }, [isMainApp, microAppContainerRef.current, setIframeMountDom]); // Depend on the ref's current value and the function

  // Micro App Specific Logic
  useEffect(() => {
    if (!isMicroApp) return;

    let corsUnlisteners: Function[] = [];

    const setupMicroApp = async () => {
      // Set initial stick status
      containerBus.data.set({ microAppStickStatus: true });

      // Parse initial data from window.name
      let iframeData: any = {};
      try {
        iframeData = JSON.parse(window.name || "{}"); // Provide default empty object
      } catch (e) {
        console.error("Failed to parse iframe data from window.name", e);
      }
      const { appInfo, parentData = {} } = iframeData;
      const initialLayoutData = parentData.layoutData;

      // Apply initial layout data slightly deferred
      // Use requestAnimationFrame or setTimeout to ensure initial render is complete
      requestAnimationFrame(() => {
        if (initialLayoutData) {
          containerBus.data.set(initialLayoutData);
        }
      });

      // Set app info
      if (appInfo) {
        microAppBus.data.set({ appInfo });
      }

      // Listen for layout data changes from main app
      const unlistenLayout = microAppBus.cors.on(
        "layoutDataChange",
        (e: any) => {
          // Maybe compare data before setting to avoid loops if microApp sends back
          containerBus.data.set(e.data);
        }
      );
      if (typeof unlistenLayout === "function")
        corsUnlisteners.push(unlistenLayout);

      // Wait for DOM refs (simpler version for microapp)
      await Promise.all(
        Object.values(layoutDomRefs).map(
          (ref) =>
            new Promise<void>((resolve) => {
              const check = () =>
                ref.current ? resolve() : requestAnimationFrame(check);
              check();
            })
        )
      );

      // Emit layoutMounted event
      containerBus.event.emit("onLayoutMounted");
      if (onLayoutMounted) {
        onLayoutMounted({
          // Only mountDom is relevant for microApp based on original code
          mountDom: teleportDomRefs.mount.current,
        });
      }
    };

    setupMicroApp();

    // Cleanup
    return () => {
      corsUnlisteners.forEach((unlisten) => unlisten());
    };
  }, [
    isMicroApp,
    containerBus,
    microAppBus,
    onLayoutMounted,
    layoutDomRefs,
    teleportDomRefs,
  ]); // Ensure necessary dependencies

  // onMounted equivalent for general purposes
  useEffect(() => {
    containerBus.event.emit("onMounted");
    // No cleanup needed for a simple emit
  }, [containerBus]); // Run only once

  // --- Render JSX ---
  return (
    <div style={finalContainerStyle}>
      {/* Nav Header */}
      <header
        style={{ display: visibles.nav ? "block" : "none" }} // v-show
        ref={layoutDomRefs.nav}
        onMouseEnter={(e) => handleMouseEvent("mouseenter", e, "nav")}
        onMouseMove={(e) => handleMouseEvent("mousemove", e, "nav")}
      >
        {isMainApp && (
          <div ref={teleportDomRefs.nav} style={{ height: "100%" }}></div>
        )}
        {isMicroApp && (
          <div
            style={{
              pointerEvents: "none",
              height: placeholderStyle.navHeight,
            }}
          ></div>
        )}
      </header>

      {/* Main Section (Menu + Content) */}
      <section style={{ flex: 1, display: "flex", minHeight: 0 }}>
        {/* Menu Aside */}
        <aside
          style={{ height: "100%", display: visibles.menu ? "block" : "none" }} // v-show
          ref={layoutDomRefs.menu}
          onMouseEnter={(e) => handleMouseEvent("mouseenter", e, "menu")}
          onMouseMove={(e) => handleMouseEvent("mousemove", e, "menu")}
        >
          {isMainApp && (
            <div ref={teleportDomRefs.menu} style={{ height: "100%" }}></div>
          )}
          {isMicroApp && (
            <div
              style={{
                pointerEvents: "none",
                width: placeholderStyle.menuWidth,
                height: "100%",
              }}
            ></div>
          )}
        </aside>

        {/* Content Area (Tab + Mount) */}
        <main
          style={{
            flex: 1,
            minWidth: 0,
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Tab Header */}
          <header
            style={{ display: visibles.tab ? "block" : "none" }} // v-show
            ref={layoutDomRefs.tab}
            onMouseEnter={(e) => handleMouseEvent("mouseenter", e, "tab")}
            onMouseMove={(e) => handleMouseEvent("mousemove", e, "tab")}
          >
            {isMainApp && (
              <div ref={teleportDomRefs.tab} style={{ height: "100%" }}></div>
            )}
            {isMicroApp && (
              <div
                style={{
                  pointerEvents: "none",
                  height: placeholderStyle.tabHeight,
                }}
              ></div>
            )}
          </header>

          {/* Mount Section */}
          <section
            ref={layoutDomRefs.mount}
            style={mountStyle} // Combined styles including v-show logic
            onMouseEnter={(e) => handleMouseEvent("mouseenter", e, "mount")}
          >
            {/* This inner div receives the teleported/actual content */}
            <div ref={teleportDomRefs.mount} style={{ height: "100%" }}>
              {/* Content goes here or is teleported here */}
            </div>
          </section>
        </main>
      </section>

      {/* Micro App Container (Main App Only) */}
      {isMainApp && (
        <div
          ref={microAppContainerRef}
          // name="mframe-micro-app-container" // 'name' is not standard HTML, use data-name or id
          data-name="mframe-micro-app-container"
          style={finalMicroAppsContainerStyle}
        >
          {/* Micro apps (iframes?) are likely mounted inside this div by the manager */}
        </div>
      )}
    </div>
  );
};

export default LayoutContainer;
