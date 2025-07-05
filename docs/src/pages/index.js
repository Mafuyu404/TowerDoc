import React from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import { useEffect } from 'react';

import styles from './index.module.css';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();

  useEffect(function () {
    let element_style = document.createElement("style");
    element_style.id = "element_style";
    document.head.append(element_style);
    let font_size = Number(localStorage.getItem("font_size"));
    if (!font_size) {
      font_size = 16;
      localStorage.setItem("font_size", 16);
    }
    document.getElementById("font_size").innerText = font_size;
  });

  function fDown() {
    localStorage.setItem("font_size", --document.getElementById("font_size").innerText);
    fApply();
  }
  function fUp() {
    localStorage.setItem("font_size", ++document.getElementById("font_size").innerText);
    fApply();
  }
  function fApply() {
    let style = `.theme-doc-markdown p { font-size: ${document.getElementById("font_size").innerText}px }`;
    document.getElementById("element_style").innerText = style;
  }
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <h1 className="hero__title">{siteConfig.title}</h1>
        {/* <p className="hero__subtitle">{siteConfig.tagline}</p> */}
        <p className="hero__subtitle" style={{fontSize: "20px", cursor: "pointer", userSelect:"none"}}>
          <span>字号偏好：</span>
          <span onClick={fDown}>-</span>&ensp;
          <span id="font_size">16</span>&ensp;
          <span onClick={fUp}>+</span>
        </p>
        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to="/docs/intro">
            开始阅读
          </Link>
        </div>
      </div>
    </header>
  );
}

export default function Home() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`首页`}
      description="还没有描述哦~">
      <HomepageHeader />
      <main>
        <HomepageFeatures />
      </main>
    </Layout>
  );
}
