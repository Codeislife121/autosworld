 (function () {
      const track = document.getElementById('brandsTrack');
      const nextBtn = document.getElementById('nextBrandBtn');

      // Full cyclic list (order matters). Keep same order as initial DOM for predictability.
      const brandData = [
  {
    name: 'LAMBORGHINI',
    img: 'https://hipfonts.com/wp-content/uploads/2022/08/Lamborghini-logo-cover.jpg',
    alt: 'Lamborghini',
    link: './pages/lambo.html'
  },
  {
    name: 'ASTON MARTIN',
    img: 'https://cdn.wallpapersafari.com/22/71/8jbM2y.jpg',
    alt: 'Aston Martin',
    link: './pages/am.html'
  },
  {
    name: 'MCLAREN',
    img: 'https://cdn.worldvectorlogo.com/logos/mclaren.svg',
    alt: 'McLaren',
    link: './pages/mcl.html'
  },
  {
    name: 'FERRARI',
    img: 'https://www.pixartprinting.co.uk/blog/wp-content/uploads/2024/03/Cover-Pixart_Ferrari.jpg',
    alt: 'Ferrari',
    link: './pages/ferrari.html'
  },
  {
    name: 'AUDI',
    img: 'https://cdn.wallpapersafari.com/49/98/Oz4IMv.jpg',
    alt: 'Audi',
    link: './pages/audi.html'
  }
];


      // How many initial cards are in the track (we started with 5)
      const initialCount = track.children.length;

      // nextIndex points to the next brand in brandData to append.
      // It starts at initialCount % brandData.length so we cycle cleanly.
      let nextIndex = initialCount % brandData.length;
      let isAnimating = false;

      function createBrandNode(item) {
  const a = document.createElement('a');
  a.href = item.link;

  const div = document.createElement('div');
  div.className = 'brand';

  const img = document.createElement('img');
  img.src = item.img;
  img.alt = item.alt;

  const label = document.createElement('div');
  label.className = 'hover-bar';
  label.textContent = item.name;

  div.appendChild(img);
  div.appendChild(label);
  a.appendChild(div);

  return a;
}


      function getGapPx() {
        const gapStyle = getComputedStyle(track).gap;
        const gap = gapStyle ? parseFloat(gapStyle) : 40;
        return isNaN(gap) ? 40 : gap;
      }

      nextBtn.addEventListener('click', () => {
        if (isAnimating) return;
        isAnimating = true;
        nextBtn.disabled = true;

        const firstBrand = track.querySelector('.brand');
        if (!firstBrand) { isAnimating = false; nextBtn.disabled = false; return; }

        // measure slide distance: first brand width + gap
        const slideWidth = firstBrand.offsetWidth + getGapPx();

        // append next brand element to the end
        const brandToAppend = brandData[nextIndex % brandData.length];
        track.appendChild(createBrandNode(brandToAppend));

        // Animate: shift the track left by slideWidth (px)
        requestAnimationFrame(() => {
          track.style.transition = 'transform 500ms cubic-bezier(.22,.9,.36,1)';
          track.style.transform = `translateX(-${slideWidth}px)`;
        });

        // when transition ends, remove the first child and reset transform
        const onTransEnd = (ev) => {
          if (ev.propertyName !== 'transform') return;
          track.removeEventListener('transitionend', onTransEnd);

          // remove first (leftmost) card (keeps total number of cards constant)
          const left = track.firstElementChild;
          if (left) track.removeChild(left);

          // reset transform without animation so remaining items sit in correct place
          track.style.transition = 'none';
          track.style.transform = 'translateX(0)';

          // force reflow so next animation can run cleanly
          void track.offsetHeight;

          // update pointer & allow next click
          nextIndex = (nextIndex + 1) % brandData.length;
          isAnimating = false;
          nextBtn.disabled = false;
        };

        track.addEventListener('transitionend', onTransEnd);
      });

      // keyboard support: right arrow
      document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') nextBtn.click();
      });
    })();
    // search bar 
    const brandFilter = document.getElementById('brandFilter');
    const priceFilter = document.getElementById('priceFilter');
    const rows = document.querySelectorAll('#carTable tbody tr');

    function filterCars() {
      const selectedBrand = brandFilter.value;
      const selectedPrice = priceFilter.value;

      rows.forEach(row => {
        const rowBrand = row.getAttribute('data-brand');
        const rowPriceRange = row.getAttribute('data-range');

        const matchesBrand = !selectedBrand || rowBrand === selectedBrand;
        const matchesPrice = !selectedPrice || rowPriceRange === selectedPrice;

        if (matchesBrand && matchesPrice) {
          row.style.display = '';
        } else {
          row.style.display = 'none';
        }
      });
    }

    brandFilter.addEventListener('change', filterCars);
    priceFilter.addEventListener('change', filterCars);
    