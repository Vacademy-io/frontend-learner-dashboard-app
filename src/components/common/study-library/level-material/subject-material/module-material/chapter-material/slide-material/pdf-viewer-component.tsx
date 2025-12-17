import {
  DocumentLoadEvent,
  PageChangeEvent,
  Viewer,
  SpecialZoomLevel,
} from "@react-pdf-viewer/core";
import { Worker } from "@react-pdf-viewer/core";

import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import { pageNavigationPlugin } from "@react-pdf-viewer/page-navigation";
import type {
  ToolbarProps,
  ToolbarSlot,
  TransformToolbarSlot,
} from "@react-pdf-viewer/toolbar";

import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import "@react-pdf-viewer/page-navigation/lib/styles/index.css";
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { Capacitor } from "@capacitor/core";

export interface PdfViewerComponentRef {
  jumpToPage: (pageIndex: number) => void;
}

export const PdfViewerComponent = forwardRef<PdfViewerComponentRef, {
  pdfUrl: string;
  handleDocumentLoad: (e: DocumentLoadEvent) => void;
  handlePageChange: (e: PageChangeEvent) => void;
  initialPage?: number;
}>(({
  pdfUrl,
  handleDocumentLoad,
  handlePageChange,
  initialPage = 0
}, ref) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [containerHeight, setContainerHeight] = useState<string>("100%");
  const [isIOS, setIsIOS] = useState(false);
  
  // Detect iOS platform using Capacitor
  useEffect(() => {
    const platform = Capacitor.getPlatform();
    setIsIOS(platform === 'ios');
  }, []);
  
  const pageNavigationPluginInstance = pageNavigationPlugin();
  const { jumpToPage } = pageNavigationPluginInstance;

  useImperativeHandle(ref, () => ({
    jumpToPage: (pageIndex: number) => {
      jumpToPage(pageIndex);
    },
  }), [jumpToPage]);

  const transform: TransformToolbarSlot = (slot: ToolbarSlot) => ({
    ...slot,
    Download: () => <></>,
    DownloadMenuItem: () => <></>,
    Open: () => <></>,
    Print: () => <></>,
    SwitchSelectionModeMenuItem: () => <></>,
  });
  
  const renderToolbar = (
    Toolbar: (props: ToolbarProps) => React.ReactElement
  ) => (
    <div className="sticky top-0 z-10 bg-white border-b border-gray-200">
      <Toolbar>{renderDefaultToolbar(transform)}</Toolbar>
    </div>
  );

  const defaultLayoutPluginInstance = defaultLayoutPlugin({
    renderToolbar,
    sidebarTabs: () => [],
  });

  const { renderDefaultToolbar } =
    defaultLayoutPluginInstance.toolbarPluginInstance;

  // iOS-specific: Dynamic Height Calculation
  // We removed the 'touchmove' listener block because it was blocking scroll events.
  useEffect(() => {
    if (!isIOS) {
      setContainerHeight("calc(100vh - 120px)");
      return;
    }

    const computeHeight = () => {
      const vh = window.innerHeight;
      // Adjust these offsets based on your actual header/tabbar size
      const headerHeight = 60; 
      const bottomSafeArea = 40; 
      
      const h = Math.max(400, vh - headerHeight - bottomSafeArea);
      setContainerHeight(`${h}px`);
    };

    computeHeight();
    window.addEventListener("resize", computeHeight);
    window.addEventListener("orientationchange", computeHeight);
    
    return () => {
      window.removeEventListener("resize", computeHeight);
      window.removeEventListener("orientationchange", computeHeight);
    };
  }, [isIOS]);

  return (
    <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
      <div
        ref={containerRef}
        // Critical for iOS: Use 'overflow-y-auto' explicitly
        className="w-full max-w-full mx-0 px-0 overflow-y-auto overflow-x-hidden custom-scrollbar bg-gray-100"
        style={{
          height: containerHeight,
          // iOS Momentum Scrolling
          WebkitOverflowScrolling: "touch",
          // Prevents the whole app from bouncing, but allows internal content to scroll
          overscrollBehaviorY: "contain",
          position: "relative",
          // Ensure touches are registered for scrolling
          touchAction: "pan-y"
        }}
      >
        <Viewer
          fileUrl={pdfUrl}
          onDocumentLoad={handleDocumentLoad}
          onPageChange={handlePageChange}
          plugins={[defaultLayoutPluginInstance, pageNavigationPluginInstance]}
          defaultScale={SpecialZoomLevel.PageWidth}
          initialPage={initialPage}
        />
      </div>
    </Worker>
  );
});