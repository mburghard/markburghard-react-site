import React, { useState, useEffect, useRef } from "react";
import Carousel from "../components/ProductCarousel";
import ProductDescription from "../components/ProductDescription";
import Sidebar from "../components/Sidebar";
import AutoplayImage from "../components/AutoplayImg";

import tire1 from "../assets/tire-iso-1.png";
import tire2 from "../assets/tire-front.png";
import tire3 from "../assets/tire-iso-2.png";
import tire4 from "../assets/tire-top-view.png";
import slashImg from "../assets/slash.png";
import tireRed from "../assets/tire-red.png";
import tireStripe from "../assets/tire-stripe.png";
import tireYellow from "../assets/tire-yellow.png";
import actionVid from "../assets/action-vid.mp4";

import siteData from "../assets/site-data";

import "../styles/ProductShowcase.css";
import "../styles/Specs.css";
import "../styles/VideoContainer.css";

const {
  features,
  specsData,
  specsData2,
  productLogo,
  featureIcons,
  tags,
  productDescriptionLong,
} = siteData;

const ProductShowcasePage = () => {
  const images = [tire1, tire2, tire3, tire4];

  const sections = [
    { id: "sectionOne", title: "Introduction" },
    { id: "sectionTwo", title: "Features and Benefits" },
    { id: "sectionThree", title: "Tire Specs" },
    { id: "sectionFour", title: "Overview in Action" },
  ];

  const sectionOneRef = useRef(null);
  const sectionTwoRef = useRef(null);
  const sectionThreeRef = useRef(null);
  const sectionFourRef = useRef(null);

  const [progress, setProgress] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [sidebarIndex, setSidebarIndex] = useState(null);

  const handleProgressChange = (newProgress) => {
    setProgress(newProgress);
  };

  const handleSectionClick = (sectionIndex) => {
    scrollToSection(sectionIndex);
    setSidebarIndex(sectionIndex);
  };

  const changeImageAndPause = (index) => {
    setCurrentImageIndex(index);
    setIsPlaying(false);
  };
  const sectionRefs = [
    sectionOneRef,
    sectionTwoRef,
    sectionThreeRef,
    sectionFourRef,
  ];

  const scrollToSection = (sectionIndex) => {
    const sectionRef = sectionRefs[sectionIndex];
    if (sectionRef && sectionRef.current) {
      window.scrollTo({
        top: sectionRef.current.offsetTop,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    const scrollNextSection = () => {
      console.log("NEXT");
      const currentSection = determineCurrentSection();
      const nextSection = getNextSection(currentSection);
      setSidebarIndex(nextSection);
      scrollToSection(nextSection);
    };

    const scrollPreviousSection = () => {
      console.log("PREV");
      const currentSection = determineCurrentSection();
      const prevSection = getPreviousSection(currentSection);
      setSidebarIndex(prevSection);
      scrollToSection(prevSection);
    };

    const determineCurrentSection = () => {
      const currentScrollPos = window.scrollY + window.innerHeight / 2;
      let currentSectionIndex = 0;

      for (let i = 0; i < sectionRefs.length; i++) {
        if (currentScrollPos >= sectionRefs[i].current.offsetTop) {
          currentSectionIndex = i;
        } else {
          break;
        }
      }
      console.log(currentSectionIndex);
      return currentSectionIndex;
    };

    const getNextSection = (currentIndex) => {
      return (currentIndex + 1) % sectionRefs.length;
    };

    const getPreviousSection = (currentIndex) => {
      return (currentIndex - 1 + sectionRefs.length) % sectionRefs.length;
    };

    let accumulatedDeltaY = 0;
    const threshold = 5;

    const throttle = (func, limit) => {
      let inThrottle;
      return function () {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
          func.apply(context, args);
          inThrottle = true;
          setTimeout(() => (inThrottle = false), limit);
        }
      };
    };

    const throttledScrollNext = throttle(scrollNextSection, 1000);
    const throttledScrollPrev = throttle(scrollPreviousSection, 1000);

    const handleScroll = (event) => {
      event.preventDefault();

      accumulatedDeltaY += event.deltaY;

      if (Math.abs(accumulatedDeltaY) >= threshold) {
        accumulatedDeltaY = 0;
        if (event.deltaY > 0) {
          throttledScrollNext();
        } else {
          throttledScrollPrev();
        }
      }
    };

    window.addEventListener("wheel", handleScroll, { passive: false });
    let initialIndex = determineCurrentSection();
    setSidebarIndex(initialIndex);
    return () => window.removeEventListener("wheel", handleScroll);
  }, [sectionOneRef, sectionTwoRef, sectionThreeRef, sectionFourRef]);

  return (
    <div>
      <div className="page-container" ref={sectionOneRef}>
        <Sidebar
          sections={sections}
          activeSection={sidebarIndex}
          onSectionClick={handleSectionClick}
        />
        <Carousel images={images} />
        <h5 className="copyright">Advan / Advan A052®</h5>
        <div className="product-description-container" id="sectionOne">
          <ProductDescription
            productLogo={productLogo}
            featureIcons={featureIcons}
          />
          <div className="tags-section">
            {tags.map((tag, index) => (
              <div key={index} className="tag">
                {tag}
              </div>
            ))}
          </div>
          <div className="product-description-long">
            {productDescriptionLong}
          </div>
          <div className="product-buttons">
            <button className="text-button">
              <span>Find a dealer</span> <span className="arrow">→</span>
            </button>
            <img src={slashImg} alt="/" className="button-slash" />
            <button className="text-button">
              <span>Will this fit my vehicle?</span>{" "}
              <span className="arrow">→</span>
            </button>
          </div>
        </div>
      </div>
      <div className="features-container" id="sectionTwo" ref={sectionTwoRef}>
        <div className="feature-buttons">
          <h2 className="feature-heading">TIRE FEATURES & BENEFITS</h2>
          {features.map((feature, index) => (
            <div
              className={`feature-button-container ${
                index === currentImageIndex ? "active" : ""
              }`}
              key={index}
            >
              <button
                className={`feature-button ${
                  index === currentImageIndex ? "active" : ""
                }`}
                onClick={() => changeImageAndPause(index)}
              >
                <div className="button-content">
                  <h3>{feature.title}</h3>
                  <p>{feature.description}</p>
                </div>
                {index === currentImageIndex && (
                  <div
                    className="button-progress-bar"
                    style={{ height: `${progress}%` }}
                  />
                )}
              </button>
            </div>
          ))}
        </div>
        <AutoplayImage
          images={[tireRed, tireYellow, tire3, tireStripe]}
          currentImageIndex={currentImageIndex}
          setCurrentImageIndex={setCurrentImageIndex}
          isPlaying={isPlaying}
          interval={7500}
          onProgressChange={handleProgressChange}
        />
      </div>
      <div className="specs-container" id="sectionThree" ref={sectionThreeRef}>
        <div className="specs-container-left">
          <div className="input-field-container">
            <h3 className="input-field-title">ADVAN A052® SIZE & SPECS</h3>
            <h6>Search for specs by tire size:</h6>
            <input
              type="text"
              className="specs-search-input"
              placeholder="Enter text..."
            />
            <h6 className="table-header">SHOWING SPECS FOR 185/55R14 80V</h6>
          </div>
          <div className="table-container">
            <div className="specs-table-col1">
              {specsData.map((item, index) => (
                <div key={index} className="specs-row">
                  <div className="specs-item-name">{item.name}</div>
                  <div className="specs-item-value">{item.value}</div>
                </div>
              ))}
            </div>
            <div className="specs-table-col2">
              {specsData2.map((item, index) => (
                <div key={index} className="specs-row">
                  <div className="specs-item-name">{item.name}</div>
                  <div className="specs-item-value">{item.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="specs-container-right">
          <img src={tire1} alt="Advan A052" className="static-image" />
          <button className="custom-button">
            <span>View All Specs </span>
          </button>
        </div>
      </div>
      <div className="video-container" id="sectionFour" ref={sectionFourRef}>
        <video autoPlay loop muted className="section-four-video">
          <source src={actionVid} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
    </div>
  );
};

export default ProductShowcasePage;
