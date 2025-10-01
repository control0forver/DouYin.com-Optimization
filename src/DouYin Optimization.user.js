// ==UserScript==
// @name         DouYin.com Optimization V1
// @namespace    http://tampermonkey.net/
// @version      0.0.3
// @description  A Tampermonkey userscript to optimize the user experience on douyin.com.
// @author       LGF
// @match        *://*.douyin.com/*
// @icon         https://cdn.jsdelivr.net/gh/control0forver/DouYin.com-Optimization@main/resc/icon.png
// @grant        none
// @updateURL    https://cdn.jsdelivr.net/gh/control0forver/DouYin.com-Optimization@main/src/DouYin%20Optimization.meta.js
// @downloadURL  https://cdn.jsdelivr.net/gh/control0forver/DouYin.com-Optimization@main/src/DouYin%20Optimization.user.js
// ==/UserScript==

(function () {
    'use strict';

    let isProcessing = false;

    function logMessage(message) {
        const prefix = GM_info?.script?.name || 'DouYin.com Optimization V1';
        console.log(`[${prefix}] ${message}`);
    }

    function proc1() {
        if (isProcessing) return;
        isProcessing = true;

        function proc1_1() {
            // Remove Empty Divs
            const bodyChildren = document.body.children;
            for (let i = bodyChildren.length - 1; i >= 0; i--) {
                const child = bodyChildren[i];

                if (child.tagName === 'DIV' &&
                    child.children.length === 0 &&
                    child.innerHTML.trim() === '') {
                    child.remove();
                }
            }

            logMessage('Removed Empty Divs');
        }

        proc1_1();
        isProcessing = false;
    }

    function proc2() {
        if (isProcessing) return;
        isProcessing = true;

        function __proc2__remove_buttons(collection) {
            for (let i = 0; i < collection.length; i++) {
                if (collection[i]) {
                    logMessage('Removing ${collection[i]}');
                    debugger;
                    collection[i].remove();
                }
            }
        }
        function __proc2__getElementByXpath(xpath) {
            const result = document.evaluate(
                xpath,
                document,
                null,
                XPathResult.FIRST_ORDERED_NODE_TYPE,
                null
            );
            return result.singleNodeValue;
        }

        function proc2_1() {
            // Remove buttons in the douyin-navigation

            // validation
            if (document.querySelector("#island_076c3 > div").children.length != 4)
                return;

            __proc2__remove_buttons([
                __proc2__getElementByXpath("/html/body/div[2]/div[1]/div[3]/div/div[2]/div/div[1]/pace-island/div/div[2]") // link: www.douyin.com/Home (useless shit)
            ]);

            logMessage('DouYin Navigation Cleaned');
        }

        function proc2_2() {
            // Remove buttons in the douyin-header

            // validation
            if (document.querySelector("#island_b69f5 > div").children.length != 7)
                return;

            let targets = [
                __proc2__getElementByXpath("/html/body/div[2]/div[1]/div[4]/div[1]/div[1]/header/div/div/div[2]/div/pace-island/div/div[1]"), // 充钻石
                __proc2__getElementByXpath("/html/body/div[2]/div[1]/div[4]/div[1]/div[1]/header/div/div/div[2]/div/pace-island/div/div[2]"), // 客户端 (下载)
                __proc2__getElementByXpath("/html/body/div[2]/div[1]/div[4]/div[1]/div[1]/header/div/div/div[2]/div/pace-island/div/div[3]"), // 壁纸
            ];
            __proc2__remove_buttons(targets);

            logMessage('DouYin Header Cleaned');
        }

        proc2_1();
        proc2_2();
        isProcessing = false;
    }

    // 防抖函数，避免频繁调用
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    const debouncedProc1 = debounce(proc1, 100);
    const debouncedProc2 = debounce(proc2, 100);

    // Start after the page is loaded
    window.addEventListener('load', function () {
        debouncedProc1();
        debouncedProc2();
    });

    // Handle DOM changes
    const observer = new MutationObserver(function (mutations) {
        if (isProcessing) return;

        let shouldProcess = false;
        for (let mutation of mutations) {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                shouldProcess = true;
                break;
            }
        }

        if (shouldProcess) {
            debouncedProc1();
            debouncedProc2();
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: false
    });

})();