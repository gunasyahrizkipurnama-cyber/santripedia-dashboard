/* FOR SANTRI dashboard. Territory data is bundled for offline use. */
const fields = {
  province: { select: 'provinceSelect', label: 'Provinsi', placeholder: 'Semua Provinsi', chip: 'P' },
  city: { select: 'citySelect', label: 'Kabupaten / Kota', placeholder: 'Pilih Kab/Kota', chip: 'K' },
  district: { select: 'districtSelect', label: 'Kecamatan', placeholder: 'Pilih Kecamatan', chip: 'C' },
  village: { select: 'villageSelect', label: 'Desa / Kelurahan', placeholder: 'Pilih Desa/Kelurahan', chip: 'D' },
};
const hierarchy = ['province', 'city', 'district', 'village'];
const pieColors = ['#23845f', '#45a97b', '#8bc69a', '#d1a14d', '#6c91c4', '#9579b8', '#d17868', '#42a2a0', '#a9b64b', '#d08daf'];
const state = { records: [], isImported: false, chartExpanded: false, toastTimer: null, search: '', tableLimit: 100, totalStudents: 0 };
const studentStorageKey = 'for-santri-student-records-v1';
const $ = (selector) => document.querySelector(selector);
const formatNumber = (value) => Number(value || 0).toLocaleString('id-ID');
const normalizeText = (value) => String(value ?? '').trim();
const catalog = { province: [], city: [], district: [], village: [] };
const catalogById = { province: new Map(), city: new Map(), district: new Map(), village: new Map() };
const childrenByParent = { city: new Map(), district: new Map(), village: new Map() };
const studentCounts = { province: new Map(), city: new Map(), district: new Map(), village: new Map() };
const sourceData = window.WILAYAH_DATA;
if (!sourceData) throw new Error('Data wilayah tidak ditemukan. Pastikan data/wilayah-data.js ikut disertakan.');
sourceData.provinces.forEach(([id, name]) => catalog.province.push({ id: String(id), name, provinceId: String(id) }));
const citiesById = new Map(sourceData.regencies.map(([id, provinceId, name]) => [String(id), { id: String(id), name, provinceId: String(provinceId) }]));
const districtsById = new Map(sourceData.districts.map(([id, cityId, name]) => [String(id), { id: String(id), name, cityId: String(cityId), provinceId: citiesById.get(String(cityId))?.provinceId || '' }]));
catalog.city = [...citiesById.values()];
catalog.district = [...districtsById.values()];
catalog.village = sourceData.villages.map(([id, districtId, name]) => {
  const normalizedDistrictId = String(districtId);
  const district = districtsById.get(normalizedDistrictId);
  return { id: String(id), name, districtId: normalizedDistrictId, cityId: district?.cityId || '', provinceId: district?.provinceId || '' };
});
hierarchy.forEach((level) => catalog[level].forEach((area) => catalogById[level].set(area.id, area)));
catalog.city.forEach((area) => { if (!childrenByParent.city.has(area.provinceId)) childrenByParent.city.set(area.provinceId, []); childrenByParent.city.get(area.provinceId).push(area); });
catalog.district.forEach((area) => { if (!childrenByParent.district.has(area.cityId)) childrenByParent.district.set(area.cityId, []); childrenByParent.district.get(area.cityId).push(area); });
catalog.village.forEach((area) => { if (!childrenByParent.village.has(area.districtId)) childrenByParent.village.set(area.districtId, []); childrenByParent.village.get(area.districtId).push(area); });
hierarchy.forEach((level) => catalog[level].sort((a, b) => a.name.localeCompare(b.name, 'id')));
Object.values(childrenByParent).forEach((groups) => groups.forEach((areas) => areas.sort((a, b) => a.name.localeCompare(b.name, 'id'))));
const regionName = (level, id) => catalogById[level].get(id)?.name || '';
const nameIndexes = { province: new Map(), city: new Map(), district: new Map(), village: new Map() };
function matchNameKey(level, value) {
  let name = normalizeText(value).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleUpperCase('id');
  name = name.replace(/\bKAB\.?\s+/g, 'KABUPATEN ').replace(/\bKEC\.?\s+/g, 'KECAMATAN ');
  name = name.replace(/\bKOTA ADM\.?\s+/g, 'KOTA ADMINISTRASI ');
  name = name.replace(/[^A-Z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim();
  if (level === 'district') name = name.replace(/^KECAMATAN\s+/, '');
  if (level === 'village') name = name.replace(/^(KELURAHAN|DESA)\s+/, '');
  if (level === 'province') {
    if (name === 'DKI JAKARTA') name = 'DAERAH KHUSUS IBUKOTA JAKARTA';
    if (name === 'DIY' || name === 'YOGYAKARTA') name = 'DAERAH ISTIMEWA YOGYAKARTA';
  }
  return name;
}
function addNameIndex(level, parentId, name, area) {
  const key = `${parentId}|${matchNameKey(level, name)}`;
  if (!nameIndexes[level].has(key)) nameIndexes[level].set(key, []);
  if (area && !nameIndexes[level].get(key).includes(area)) nameIndexes[level].get(key).push(area);
  const simpleName = matchNameKey(level, name).replace(/^(KABUPATEN|KOTA ADMINISTRASI|KOTA|KECAMATAN|KELURAHAN|DESA)\s+/, '');
  if (simpleName) {
    const simpleKey = `${parentId}|${simpleName}`;
    if (!nameIndexes[level].has(simpleKey)) nameIndexes[level].set(simpleKey, []);
    if (area && !nameIndexes[level].get(simpleKey).includes(area)) nameIndexes[level].get(simpleKey).push(area);
  }
}
hierarchy.forEach((level) => catalog[level].forEach((area) => {
  const parentId = level === 'province' ? '' : level === 'city' ? area.provinceId : level === 'district' ? area.cityId : area.districtId;
  addNameIndex(level, parentId, area.name, area);
}));
addNameIndex('province', '', 'DKI Jakarta', catalog.province.find((area) => area.name === 'Daerah Khusus Ibukota Jakarta'));
addNameIndex('province', '', 'DIY', catalog.province.find((area) => area.name === 'Daerah Istimewa Yogyakarta'));

const provinceSelect = $('#provinceSelect');
const citySelect = $('#citySelect');
const districtSelect = $('#districtSelect');
const villageSelect = $('#villageSelect');
const filterSelects = { province: provinceSelect, city: citySelect, district: districtSelect, village: villageSelect };

function currentFilters() {
  return Object.fromEntries(hierarchy.map((key) => [key, filterSelects[key].value]));
}

function sumRecords(records) {
  return records.reduce((total, record) => total + (Number(record.count) || 0), 0);
}

function selectedLevel() {
  const values = currentFilters();
  for (let index = hierarchy.length - 1; index >= 0; index -= 1) {
    if (values[hierarchy[index]]) return hierarchy[index];
  }
  return null;
}

function areaMatchesFilters(area, level, filters = currentFilters()) {
  const ids = {
    province: level === 'province' ? area.id : area.provinceId,
    city: level === 'city' ? area.id : area.cityId,
    district: level === 'district' ? area.id : area.districtId,
    village: level === 'village' ? area.id : '',
  };
  return (!filters.province || ids.province === filters.province)
    && (!filters.city || ids.city === filters.city)
    && (!filters.district || ids.district === filters.district)
    && (!filters.village || ids.village === filters.village);
}

function areasAtLevel(level, filters = currentFilters()) {
  return catalog[level].filter((area) => areaMatchesFilters(area, level, filters));
}

function countFor(level, id) { return studentCounts[level].get(id) || 0; }

function sumSelectedStudents(filters = currentFilters()) {
  const level = selectedLevel();
  if (level) return countFor(level, filters[level]);
  return state.totalStudents;
}

function updateSelect(select, placeholder, areas, selected, disabled = false) {
  select.replaceChildren(new Option(placeholder, ''));
  areas.forEach((area) => select.add(new Option(area.name, String(area.id))));
  select.disabled = disabled;
  const selectedValue = String(selected ?? '');
  select.value = areas.some((area) => String(area.id) === selectedValue) ? selectedValue : '';
}

function updateFilterOptions() {
  const filters = currentFilters();
  updateSelect(provinceSelect, fields.province.placeholder, catalog.province, filters.province);
  const province = provinceSelect.value;
  const cities = province ? childrenByParent.city.get(province) || [] : [];
  updateSelect(citySelect, fields.city.placeholder, cities, filters.city, !province);
  const city = citySelect.value;
  const districts = city ? childrenByParent.district.get(city) || [] : [];
  updateSelect(districtSelect, fields.district.placeholder, districts, filters.district, !city);
  const district = districtSelect.value;
  const villages = district ? childrenByParent.village.get(district) || [] : [];
  updateSelect(villageSelect, fields.village.placeholder, villages, filters.village, !district);
}

function breakdownConfig() {
  const selected = selectedLevel();
  if (!selected) return { childLevel: 'province', parentId: '', title: 'Jumlah santri per Provinsi', tableTitle: 'Daftar Provinsi', parentTitle: 'Indonesia' };
  const index = hierarchy.indexOf(selected);
  if (index === hierarchy.length - 1) return { childLevel: null, parentId: currentFilters()[selected], title: 'Wilayah terpilih', tableTitle: 'Rincian wilayah', parentTitle: '' };
  const childLevel = hierarchy[index + 1];
  return {
    childLevel,
    parentId: currentFilters()[selected],
    title: `Jumlah santri per ${fields[childLevel].label}`,
    tableTitle: `Daftar ${fields[childLevel].label}`,
    parentTitle: filtersName(selected),
  };
}

function filtersName(level) { return regionName(level, filterSelects[level].value); }

function renderCrumbs() {
  const values = currentFilters();
  const crumbContainer = $('#locationCrumbs');
  const chosen = hierarchy.filter((key) => values[key]);
  if (!chosen.length) {
    crumbContainer.innerHTML = '<strong>Indonesia</strong><span class="crumb-sep">/</span><span>Semua wilayah</span>';
    return;
  }
  const crumbs = ['<span>Indonesia</span>'];
  chosen.forEach((key) => {
    crumbs.push('<span class="crumb-sep">/</span>', `<strong>${escapeHtml(regionName(key, values[key]))}</strong>`);
  });
  crumbContainer.innerHTML = crumbs.join('');
}

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]);
}

function renderStats() {
  $('#totalStudents').textContent = formatNumber(sumSelectedStudents());
  $('#provinceCount').textContent = formatNumber(areasAtLevel('province').length);
  $('#cityCount').textContent = formatNumber(areasAtLevel('city').length);
  $('#districtCount').textContent = formatNumber(areasAtLevel('district').length);
  $('#provinceContext').textContent = 'wilayah dalam filter aktif';
}

function makeBreakdown(config) {
  let areas;
  if (!config.childLevel) {
    const level = selectedLevel();
    const id = currentFilters()[level];
    const area = catalogById[level].get(id);
    areas = area ? [area] : [];
  } else if (config.childLevel === 'province') {
    areas = catalog.province;
  } else {
    areas = childrenByParent[config.childLevel].get(config.parentId) || [];
  }
  return areas.map((area) => {
    const level = config.childLevel || selectedLevel();
    const levelIndex = hierarchy.indexOf(level);
    const parentId = level === 'city' ? area.provinceId : level === 'district' ? area.cityId : level === 'village' ? area.districtId : '';
    const parentLevel = levelIndex > 0 ? hierarchy[levelIndex - 1] : null;
    return {
      id: area.id,
      name: area.name,
      parent: parentLevel ? regionName(parentLevel, parentId) : config.parentTitle,
      count: countFor(level, area.id),
      level,
    };
  }).sort((a, b) => b.count - a.count || a.name.localeCompare(b.name, 'id'));
}

function pieSlicePath(startAngle, endAngle, radius = 96, center = 110) {
  if (endAngle - startAngle >= (Math.PI * 2) - 0.000001) {
    return `M ${center} ${center - radius} A ${radius} ${radius} 0 1 1 ${center} ${center + radius} A ${radius} ${radius} 0 1 1 ${center} ${center - radius} Z`;
  }
  const startX = center + radius * Math.cos(startAngle);
  const startY = center + radius * Math.sin(startAngle);
  const endX = center + radius * Math.cos(endAngle);
  const endY = center + radius * Math.sin(endAngle);
  const largeArc = endAngle - startAngle > Math.PI ? 1 : 0;
  return `M ${center} ${center} L ${startX} ${startY} A ${radius} ${radius} 0 ${largeArc} 1 ${endX} ${endY} Z`;
}

function formatPercent(value) {
  return `${value.toLocaleString('id-ID', { maximumFractionDigits: 1 })}%`;
}

function formatShare(total, count) {
  return total ? formatPercent((count / total) * 100) : '0%';
}

function renderChart(items, config) {
  $('#breakdownTitle').textContent = config.title;
  $('#breakdownSubtitle').textContent = config.childLevel
    ? `Rincian ${fields[config.childLevel].label.toLocaleLowerCase('id')} di wilayah terpilih`
    : 'Ringkasan jumlah santri pada wilayah terpilih';
  $('#chartLevelLabel').textContent = config.childLevel ? fields[config.childLevel].label.toUpperCase() : 'WILAYAH TERPILIH';
  const chart = $('#pieChart');
  if (!items.length) {
    const nextArea = config.childLevel ? fields[config.childLevel].label.toLocaleLowerCase('id') : 'wilayah ini';
    chart.innerHTML = `<div class="chart-empty">Belum ada data untuk ${escapeHtml(nextArea)}.</div>`;
    $('#chartShowing').textContent = 'Belum ada data untuk filter ini';
    $('#showAllButton').style.visibility = 'hidden';
    return;
  }

  const total = sumRecords(items);
  const displayLimit = state.chartExpanded ? 12 : 6;
  const visibleItems = items.length > displayLimit ? items.slice(0, displayLimit - 1) : items;
  const otherItems = items.slice(visibleItems.length);
  const chartItems = visibleItems.map((item, index) => ({ ...item, color: pieColors[index % pieColors.length] }));
  if (otherItems.length) {
    chartItems.push({
      name: `Lainnya (${formatNumber(otherItems.length)} wilayah)`,
      count: sumRecords(otherItems),
      level: null,
      isAggregate: true,
      color: '#bdcec4',
    });
  }

  let angle = -Math.PI / 2;
  const slices = total ? chartItems.map((item) => {
    const share = (item.count / total) * 100;
    const nextAngle = angle + (share / 100) * Math.PI * 2;
    const path = pieSlicePath(angle, nextAngle);
    angle = nextAngle;
    return `<path class="pie-segment" d="${path}" fill="${item.color}"><title>${escapeHtml(item.name)}: ${formatNumber(item.count)} santri (${formatPercent(share)})</title></path>`;
  }).join('') : '<circle class="pie-empty-ring" cx="110" cy="110" r="88" />';
  const levelLabel = config.childLevel ? fields[config.childLevel].label : 'wilayah terpilih';
  const legend = chartItems.map((item) => {
    const share = total ? (item.count / total) * 100 : 0;
    const shareLabel = formatShare(total, item.count);
    const contents = `<span class="pie-legend-swatch" style="background:${item.color}"></span><span class="pie-legend-name">${escapeHtml(item.name)}</span><span class="pie-legend-count">${formatNumber(item.count)}</span><span class="pie-legend-share">${shareLabel}</span>`;
    const label = `${item.name}, ${formatNumber(item.count)} santri, ${shareLabel}`;
    return item.isAggregate
      ? `<div class="pie-legend-row pie-legend-row-other" aria-label="${escapeHtml(label)}">${contents}</div>`
      : `<button class="pie-legend-row" type="button" data-level="${escapeHtml(item.level)}" data-id="${escapeHtml(item.id)}" aria-label="Lihat ${escapeHtml(label)}">${contents}</button>`;
  }).join('');

  const emptyNote = total ? '' : '<p class="pie-empty-note">Belum ada jumlah santri. Pie chart akan terisi setelah data santri diimpor.</p>';
  chart.innerHTML = `<div class="pie-visual"><svg class="pie-svg" viewBox="0 0 220 220" role="img" aria-label="Diagram lingkaran ${total ? `jumlah santri menurut ${escapeHtml(levelLabel)}; total ${formatNumber(total)} santri` : 'kosong karena belum ada jumlah santri'}">${slices}</svg></div><div class="pie-legend">${legend}${emptyNote}</div>`;
  chart.querySelectorAll('button[data-level]').forEach((button) => button.addEventListener('click', () => drillDown(button.dataset.level, button.dataset.id)));
  $('#chartShowing').textContent = otherItems.length
    ? `${formatNumber(visibleItems.length)} wilayah teratas + ${formatNumber(otherItems.length)} lainnya`
    : total ? `Komposisi ${formatNumber(items.length)} wilayah` : `${formatNumber(items.length)} wilayah • belum ada data santri`;
  $('#showAllButton').style.visibility = items.length > 6 ? 'visible' : 'hidden';
  $('#showAllButton').textContent = state.chartExpanded ? 'Tampilkan lebih sedikit ↓' : 'Tampilkan lebih banyak →';
}

function renderHierarchy() {
  const values = currentFilters();
  const container = $('#hierarchyList');
  container.innerHTML = hierarchy.map((level) => {
    const id = values[level];
    const name = id ? regionName(level, id) : `Semua ${fields[level].label}`;
    const amount = id ? formatNumber(countFor(level, id)) : formatNumber(areasAtLevel(level).length);
    const unit = id ? 'santri' : 'area';
    return `<div class="hierarchy-row"><div class="hierarchy-node"><span class="node-dot"></span><span class="node-label"><small>${fields[level].label.toUpperCase()}</small><strong>${escapeHtml(name)}</strong></span></div><span class="hierarchy-count">${amount} <span>${unit}</span></span></div>`;
  }).join('');
}

function renderTable(items, config) {
  $('#tableTitle').textContent = config.tableTitle;
  $('#tableSubtitle').textContent = config.childLevel ? `Pilih wilayah untuk menelusuri data hingga tingkat desa atau kelurahan.` : 'Wilayah yang dipilih sudah berada di tingkat desa atau kelurahan.';
  const tbody = $('#areaTableBody');
  const search = state.search.toLocaleLowerCase('id');
  const matchingItems = items.filter((item) => !search || `${item.name} ${item.parent}`.toLocaleLowerCase('id').includes(search));
  const visibleItems = matchingItems.slice(0, state.tableLimit);
  const loadMore = $('#loadMoreButton');
  if (!matchingItems.length) {
    const message = search ? 'Tidak ada wilayah yang cocok dengan pencarian.' : 'Tidak ada rincian wilayah pada pilihan ini.';
    tbody.innerHTML = `<tr><td colspan="6" class="empty-row">${message}</td></tr>`;
    $('#tableSummary').textContent = search ? '0 hasil pencarian' : 'Tidak ada tingkat wilayah lanjutan';
    loadMore.hidden = true;
    return;
  }
  const total = sumRecords(items);
  tbody.innerHTML = visibleItems.map((item, index) => {
    const share = total ? (item.count / total) * 100 : 0;
    const level = item.level || config.childLevel || selectedLevel() || 'province';
    const parent = item.parent || config.parentTitle || 'Indonesia';
    const chip = fields[level]?.chip || 'W';
    const chipClass = level === 'city' ? 'city' : level === 'district' ? 'district' : level === 'village' ? 'village' : '';
    const shareLabel = formatShare(total, item.count);
    return `<tr>
      <td class="rank-col"><span class="rank-num">${String(index + 1).padStart(2, '0')}</span></td>
      <td><span class="area-name-cell"><span class="area-chip ${chipClass}">${chip}</span>${escapeHtml(item.name)}</span></td>
      <td class="parent-name">${escapeHtml(parent)}</td>
      <td class="count-cell">${formatNumber(item.count)}</td>
      <td><span class="share-cell"><span class="share-track" role="meter" aria-label="Porsi ${escapeHtml(item.name)}" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${Math.min(100, share).toFixed(1)}"><span class="share-fill" aria-hidden="true" style="width:${Math.min(100, share)}%"></span></span><span class="share-value">${shareLabel}</span></span></td>
      <td><button class="row-open" type="button" data-level="${escapeHtml(level)}" data-id="${escapeHtml(item.id)}" title="Lihat rincian ${escapeHtml(item.name)}" aria-label="Lihat rincian ${escapeHtml(item.name)}"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="m9 18 6-6-6-6"/></svg></button></td>
    </tr>`;
  }).join('');
  tbody.querySelectorAll('.row-open').forEach((button) => button.addEventListener('click', () => drillDown(button.dataset.level, button.dataset.id)));
  $('#tableSummary').textContent = `${formatNumber(visibleItems.length)} dari ${formatNumber(matchingItems.length)} wilayah • ${formatNumber(sumSelectedStudents())} santri`;
  loadMore.hidden = matchingItems.length <= visibleItems.length;
}

function render() {
  updateFilterOptions();
  const config = breakdownConfig();
  const items = makeBreakdown(config);
  renderCrumbs();
  renderStats();
  renderChart(items, config);
  renderHierarchy();
  renderTable(items, config);
  $('#recordCountLabel').textContent = state.isImported ? `${formatNumber(state.records.length)} baris santri dimuat` : `${formatNumber(catalog.province.length)} provinsi • master wilayah nasional`;
  $('#modePill').innerHTML = `<span></span> ${state.isImported ? 'DATA IMPOR' : 'MASTER WILAYAH'}`;
  $('#tableModeLabel').textContent = state.isImported ? 'Data santri dari file • tersimpan sementara di perangkat' : 'Master wilayah Indonesia • jumlah santri belum tersedia';
}

function drillDown(level, value) {
  if (!fields[level]) return;
  const index = hierarchy.indexOf(level);
  filterSelects[level].value = value;
  hierarchy.slice(index + 1).forEach((key) => { filterSelects[key].value = ''; });
  state.search = '';
  state.tableLimit = 100;
  $('#tableSearch').value = '';
  render();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function resetFilters() {
  hierarchy.forEach((key) => { filterSelects[key].value = ''; });
  state.search = '';
  state.chartExpanded = false;
  state.tableLimit = 100;
  $('#tableSearch').value = '';
  render();
}

function toast(message, isError = false) {
  const box = $('#toast');
  $('#toastText').textContent = message;
  box.classList.toggle('error', isError);
  box.querySelector('.toast-dot').style.background = isError ? '#d5665e' : '#36a47b';
  box.classList.add('show');
  clearTimeout(state.toastTimer);
  state.toastTimer = setTimeout(() => box.classList.remove('show'), 4800);
}

function parseCsv(text) {
  const delimiter = (text.split(/\r?\n/, 1)[0].match(/;/g) || []).length > (text.split(/\r?\n/, 1)[0].match(/,/g) || []).length ? ';' : ',';
  const rows = [];
  let row = [];
  let cell = '';
  let quoted = false;
  for (let index = 0; index < text.length; index += 1) {
    const character = text[index];
    if (character === '"' && quoted && text[index + 1] === '"') { cell += '"'; index += 1; }
    else if (character === '"') quoted = !quoted;
    else if (character === delimiter && !quoted) { row.push(cell); cell = ''; }
    else if ((character === '\n' || character === '\r') && !quoted) {
      if (character === '\r' && text[index + 1] === '\n') index += 1;
      row.push(cell); cell = '';
      if (row.some((value) => value.trim() !== '')) rows.push(row);
      row = [];
    } else cell += character;
  }
  row.push(cell);
  if (row.some((value) => value.trim() !== '')) rows.push(row);
  if (rows.length < 2) throw new Error('File tidak berisi baris data.');
  const headers = rows[0].map((value) => value.replace(/^\uFEFF/, '').trim());
  return rows.slice(1).map((values) => Object.fromEntries(headers.map((header, index) => [header, values[index] ?? ''])));
}

function columnIndex(cellRef) {
  const letters = String(cellRef).match(/^[A-Z]+/i)?.[0]?.toUpperCase() || '';
  return [...letters].reduce((result, letter) => result * 26 + letter.charCodeAt(0) - 64, 0) - 1;
}

function xmlText(node) {
  return [...node.getElementsByTagName('*')].filter((item) => item.localName === 't').map((item) => item.textContent || '').join('');
}

function parseXml(text, label) {
  const doc = new DOMParser().parseFromString(text, 'application/xml');
  if (doc.getElementsByTagName('parsererror').length) throw new Error(`Struktur ${label} tidak dapat dibaca.`);
  return doc;
}

async function parseXlsx(file) {
  if (!window.JSZip) throw new Error('Pustaka pembaca Excel tidak tersedia. Coba gunakan file CSV.');
  const zip = await JSZip.loadAsync(file);
  const workbookXml = await zip.file('xl/workbook.xml')?.async('string');
  const relsXml = await zip.file('xl/_rels/workbook.xml.rels')?.async('string');
  if (!workbookXml || !relsXml) throw new Error('File bukan workbook Excel .xlsx yang didukung.');
  const workbookDoc = parseXml(workbookXml, 'workbook Excel');
  const relsDoc = parseXml(relsXml, 'relasi workbook');
  const sheets = [...workbookDoc.getElementsByTagName('*')].filter((item) => item.localName === 'sheet');
  const targetSheet = sheets.find((item) => item.getAttribute('name') === 'Data Santri') || sheets[0];
  if (!targetSheet) throw new Error('Tidak ditemukan lembar data di file Excel.');
  const relationshipId = [...targetSheet.attributes].find((attribute) => attribute.localName === 'id')?.value;
  const relationship = [...relsDoc.getElementsByTagName('*')].find((item) => item.localName === 'Relationship' && item.getAttribute('Id') === relationshipId);
  if (!relationship) throw new Error('Relasi lembar Excel tidak ditemukan.');
  let target = relationship.getAttribute('Target').replace(/^\//, '');
  if (target.startsWith('../')) target = target.replace(/^\.\.\//, '');
  if (!target.startsWith('xl/')) target = `xl/${target}`;
  const sheetFile = zip.file(target);
  if (!sheetFile) throw new Error('Isi lembar data tidak ditemukan di file Excel.');
  const sheetDoc = parseXml(await sheetFile.async('string'), 'lembar data');
  const sharedFile = zip.file('xl/sharedStrings.xml');
  const sharedStrings = sharedFile ? [...parseXml(await sharedFile.async('string'), 'daftar teks Excel').getElementsByTagName('*')].filter((item) => item.localName === 'si').map(xmlText) : [];
  const sheetRows = [...sheetDoc.getElementsByTagName('*')].filter((item) => item.localName === 'row');
  const parsedRows = sheetRows.map((rowNode) => {
    const result = [];
    [...rowNode.getElementsByTagName('*')].filter((item) => item.localName === 'c').forEach((cell) => {
      const index = columnIndex(cell.getAttribute('r'));
      const type = cell.getAttribute('t');
      const valueNode = [...cell.children].find((child) => child.localName === 'v');
      let value = valueNode?.textContent ?? '';
      if (type === 's') value = sharedStrings[Number(value)] ?? '';
      else if (type === 'inlineStr') value = xmlText(cell);
      result[index] = value;
    });
    return result;
  });
  const headerIndex = parsedRows.findIndex((row) => row.includes('ID Santri') && row.includes('Provinsi'));
  if (headerIndex < 0) throw new Error('Header ID Santri dan Provinsi tidak ditemukan. Gunakan template Excel yang disertakan.');
  const headers = parsedRows[headerIndex];
  return parsedRows.slice(headerIndex + 1).map((values) => Object.fromEntries(headers.map((header, index) => [header, values[index] ?? ''])));
}

function normalizeImportedRow(source) {
  const valueFor = (...keys) => {
    const wanted = new Set(keys.map((key) => key.toLocaleLowerCase('id')));
    const key = Object.keys(source).find((candidate) => wanted.has(candidate.trim().toLocaleLowerCase('id')));
    return key ? normalizeText(source[key]) : '';
  };
  const province = valueFor('Provinsi');
  const city = valueFor('Kabupaten/Kota', 'Kabupaten / Kota', 'Kab/Kota');
  const district = valueFor('Kecamatan');
  const village = valueFor('Desa/Kelurahan', 'Desa / Kelurahan');
  const id = valueFor('ID Santri');
  const name = valueFor('Nama Santri', 'Nama Lengkap Santri', 'Nama Lengkap', 'Nama');
  const gender = valueFor('Jenis Kelamin', 'Gender');
  const countValue = normalizeText(source['Jumlah Santri'] ?? source['jumlah_santri'] ?? '');
  const countText = /^\d{1,3}([.,]\d{3})+$/.test(countValue) ? countValue.replace(/[.,]/g, '') : countValue.replace(',', '.');
  const parsedCount = countText ? Number(countText) : null;
  const countInvalid = Boolean(countValue) && (!Number.isFinite(parsedCount) || parsedCount < 0);
  const count = !countValue ? (id ? 1 : 0) : countInvalid ? 0 : parsedCount;
  return {
    id, name, gender, province, city, district, village,
    villageType: valueFor('Jenis Wilayah'),
    count,
    countInvalid,
  };
}

function findImportedArea(level, parentId, name) {
  if (!name) return null;
  const candidates = nameIndexes[level].get(`${parentId}|${matchNameKey(level, name)}`) || [];
  return candidates.length === 1 ? candidates[0] : null;
}

function resolveImportedAreas(record) {
  const province = findImportedArea('province', '', record.province);
  let city = province ? findImportedArea('city', province.id, record.city) : null;
  if (!city && province && record.city && record.district) {
    const key = matchNameKey('city', record.city).replace(/^(KABUPATEN|KOTA ADMINISTRASI|KOTA)\s+/, '');
    const candidates = nameIndexes.city.get(`${province.id}|${key}`) || [];
    city = candidates.find((candidate) => findImportedArea('district', candidate.id, record.district)) || null;
  }
  const district = city ? findImportedArea('district', city.id, record.district) : null;
  const village = district ? findImportedArea('village', district.id, record.village) : null;
  return { province, city, district, village };
}

function applyImportedRecords(records) {
  hierarchy.forEach((level) => studentCounts[level].clear());
  state.totalStudents = 0;
  let unresolved = 0;
  records.forEach((record) => {
    state.totalStudents += record.count;
    const matched = resolveImportedAreas(record);
    record.regionIds = Object.fromEntries(hierarchy.map((level) => [level, matched[level]?.id || '']));
    if (!matched.province || !matched.city || !matched.district || !matched.village) unresolved += 1;
    hierarchy.forEach((level) => {
      if (!matched[level]) return;
      studentCounts[level].set(matched[level].id, countFor(level, matched[level].id) + record.count);
    });
  });
  return unresolved;
}

async function importFile(file) {
  try {
    let sourceRows;
    if (/\.csv$/i.test(file.name)) sourceRows = parseCsv(await file.text());
    else if (/\.xlsx$/i.test(file.name)) sourceRows = await parseXlsx(file);
    else throw new Error('Gunakan file Excel .xlsx atau CSV.');
    const imported = sourceRows.map(normalizeImportedRow).filter((record) => record.id || record.province || record.city || record.district || record.village);
    if (!imported.length) throw new Error('Tidak ada baris data santri yang dapat dibaca.');
    const unresolvedArea = applyImportedRecords(imported);
    const cleanedCounts = imported.filter((record) => record.countInvalid).length;
    const ids = imported.map((record) => record.id).filter(Boolean);
    const duplicates = ids.length - new Set(ids).size;
    state.records = imported;
    state.isImported = true;
    const persisted = saveStudentRecords();
    state.chartExpanded = false;
    state.search = '';
    state.tableLimit = 100;
    $('#tableSearch').value = '';
    hierarchy.forEach((key) => { filterSelects[key].value = ''; });
    render();
    const notes = [];
    if (unresolvedArea) notes.push(`${formatNumber(unresolvedArea)} baris wilayah tidak cocok dengan master data`);
    if (cleanedCounts) notes.push(`${formatNumber(cleanedCounts)} nilai jumlah bermasalah dibersihkan menjadi 0`);
    if (duplicates) notes.push(`${formatNumber(duplicates)} ID ganda, periksa agar jumlah tidak berlebih`);
    if (!persisted) notes.push('browser tidak dapat menyimpan data setelah halaman ditutup');
    toast(`${formatNumber(imported.length)} baris santri dimuat${notes.length ? `. Catatan: ${notes.join('; ')}.` : ` dari ${file.name}.`}`);
  } catch (error) {
    console.error(error);
    toast(error.message || 'File belum dapat dibaca. Periksa format dan nama kolom.', true);
  } finally {
    $('#fileInput').value = '';
  }
}

function csvEscape(value) {
  const text = String(value ?? '');
  return `"${text.replace(/"/g, '""')}"`;
}

function saveStudentRecords() {
  try {
    localStorage.setItem(studentStorageKey, JSON.stringify(state.records));
    return true;
  } catch (error) {
    console.warn('Penyimpanan lokal tidak tersedia.', error);
    return false;
  }
}

function renderStudentRows() {
  const body = $('#studentRows');
  const query = normalizeText($('#studentSearch').value).toLocaleLowerCase('id');
  const records = state.records.map((record, index) => ({ record, index })).filter(({ record }) => {
    if (!query) return true;
    return [record.id, record.name, record.gender, record.province, record.city, record.district, record.village]
      .some((value) => normalizeText(value).toLocaleLowerCase('id').includes(query));
  });
  $('#studentTotal').textContent = formatNumber(state.records.length);
  if (!records.length) {
    body.innerHTML = `<tr><td class="student-empty" colspan="5">${query ? 'Data santri yang cocok tidak ditemukan.' : 'Belum ada data santri. Tambahkan data secara manual atau impor file.'}</td></tr>`;
    return;
  }
  body.innerHTML = records.map(({ record, index }) => {
    const name = normalizeText(record.name) || 'Nama belum tercatat';
    const identity = normalizeText(record.id) || 'Tanpa ID';
    const region = [record.village, record.district, record.city, record.province].filter(Boolean).join(', ') || 'Wilayah belum tercatat';
    const amount = Number(record.count ?? 1);
    return `<tr><td><strong>${escapeHtml(name)}</strong><small>${escapeHtml(identity)}</small></td><td>${escapeHtml(record.gender || '—')}</td><td>${escapeHtml(region)}</td><td>${formatNumber(amount)}</td><td><button class="student-delete" type="button" data-delete-student="${index}" aria-label="Hapus data ${escapeHtml(name)}">Hapus</button></td></tr>`;
  }).join('');
  body.querySelectorAll('[data-delete-student]').forEach((button) => button.addEventListener('click', () => {
    const index = Number(button.dataset.deleteStudent);
    const record = state.records[index];
    if (!record || !window.confirm(`Hapus data santri ${record.name || record.id || 'ini'}?`)) return;
    state.records.splice(index, 1);
    state.isImported = state.records.length > 0;
    applyImportedRecords(state.records);
    const saved = saveStudentRecords();
    render();
    renderStudentRows();
    toast(saved ? 'Data santri berhasil dihapus.' : 'Data dihapus, tetapi browser tidak dapat menyimpannya untuk sesi berikutnya.', !saved);
  }));
}

function updateStudentLocationOptions() {
  const province = $('#studentProvince');
  if (!province) return;
  if (province.options.length <= 1) updateSelect(province, 'Pilih Provinsi', catalog.province, province.value);
  province.disabled = false;
  const city = $('#studentCity');
  updateSelect(city, 'Pilih Kab/Kota', province.value ? childrenByParent.city.get(province.value) || [] : [], city.value, !province.value);
  const district = $('#studentDistrict');
  updateSelect(district, 'Pilih Kecamatan', city.value ? childrenByParent.district.get(city.value) || [] : [], district.value, !city.value);
  const village = $('#studentVillage');
  updateSelect(village, 'Pilih Desa/Kelurahan', district.value ? childrenByParent.village.get(district.value) || [] : [], village.value, !district.value);
}

function openStudentManager() {
  $('#studentBackdrop').hidden = false;
  $('#studentFormPanel').hidden = true;
  $('#studentSearch').value = '';
  renderStudentRows();
  updateStudentLocationOptions();
  $('#studentNav').classList.add('active');
  $('#studentNav').setAttribute('aria-current', 'page');
  const dashboardNav = document.querySelector('.main-nav .nav-item[href="#dashboard"]');
  dashboardNav?.classList.remove('active');
  dashboardNav?.removeAttribute('aria-current');
  $('#closeStudentButton').focus();
}

function closeStudentManager() {
  $('#studentBackdrop').hidden = true;
  $('#studentNav').classList.remove('active');
  $('#studentNav').removeAttribute('aria-current');
  const dashboardNav = document.querySelector('.main-nav .nav-item[href="#dashboard"]');
  dashboardNav?.classList.add('active');
  dashboardNav?.setAttribute('aria-current', 'page');
  document.querySelector('#importButton')?.focus();
}

function addStudent(event) {
  event.preventDefault();
  const id = normalizeText($('#studentId').value);
  if (state.records.some((record) => normalizeText(record.id).toLocaleLowerCase('id') === id.toLocaleLowerCase('id'))) {
    toast('ID santri sudah terdaftar. Gunakan ID yang berbeda.', true);
    $('#studentId').focus();
    return;
  }
  const getAreaName = (level, selectId) => catalogById[level].get($(selectId).value)?.name || '';
  const record = {
    id,
    name: normalizeText($('#studentName').value),
    gender: $('#studentGender').value,
    province: getAreaName('province', '#studentProvince'),
    city: getAreaName('city', '#studentCity'),
    district: getAreaName('district', '#studentDistrict'),
    village: getAreaName('village', '#studentVillage'),
    villageType: '',
    count: 1,
    countInvalid: false,
  };
  state.records.push(record);
  state.isImported = true;
  applyImportedRecords(state.records);
  const saved = saveStudentRecords();
  render();
  renderStudentRows();
  $('#studentFormPanel').hidden = true;
  $('#studentForm').reset();
  updateStudentLocationOptions();
  toast(saved ? 'Data santri berhasil ditambahkan.' : 'Data ditambahkan, tetapi browser tidak dapat menyimpannya untuk sesi berikutnya.', !saved);
}

function exportSummary() {
  const config = breakdownConfig();
  const items = makeBreakdown(config);
  if (!items.length) { toast('Tidak ada rincian wilayah untuk diekspor.', true); return; }
  const rows = [['Kode Wilayah', 'Wilayah', 'Wilayah Induk', 'Jumlah Santri', 'Persentase']];
  const total = sumRecords(items);
  items.forEach((item) => rows.push([item.id, item.name, item.parent || config.parentTitle || 'Indonesia', item.count, total ? `${((item.count / total) * 100).toFixed(1)}%` : '0%']));
  const csv = `\uFEFF${rows.map((row) => row.map(csvEscape).join(',')).join('\r\n')}`;
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = `for-santri-ringkasan-${new Date().toISOString().slice(0, 10)}.csv`;
  anchor.click();
  URL.revokeObjectURL(url);
  toast('Ringkasan wilayah berhasil diekspor sebagai CSV.');
}

function setToday() {
  const now = new Date();
  $('#todayLabel').textContent = new Intl.DateTimeFormat('id-ID', { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' }).format(now);
  $('#yearLabel').textContent = now.getFullYear();
}

function openModal() { $('#modalBackdrop').hidden = false; $('#modalDone').focus(); }
function closeModal() { $('#modalBackdrop').hidden = true; }

hierarchy.forEach((key) => filterSelects[key].addEventListener('change', () => {
  const index = hierarchy.indexOf(key);
  hierarchy.slice(index + 1).forEach((lower) => { filterSelects[lower].value = ''; });
  state.chartExpanded = false;
  state.tableLimit = 100;
  render();
}));

$('#resetFilters').addEventListener('click', resetFilters);
$('#importButton').addEventListener('click', () => $('#fileInput').click());
$('#fileInput').addEventListener('change', (event) => { if (event.target.files?.[0]) importFile(event.target.files[0]); });
$('#exportButton').addEventListener('click', exportSummary);
$('#tableExportButton').addEventListener('click', exportSummary);
$('#showAllButton').addEventListener('click', () => { state.chartExpanded = !state.chartExpanded; render(); });
$('#tableSearch').addEventListener('input', (event) => { state.search = event.target.value.trim(); state.tableLimit = 100; render(); });
$('#loadMoreButton').addEventListener('click', () => { state.tableLimit += 100; render(); });
$('#helpButton').addEventListener('click', openModal);
$('#aboutLink').addEventListener('click', openModal);
$('#modalClose').addEventListener('click', closeModal);
$('#modalDone').addEventListener('click', closeModal);
$('#modalBackdrop').addEventListener('click', (event) => { if (event.target === $('#modalBackdrop')) closeModal(); });
document.addEventListener('keydown', (event) => {
  if (event.key !== 'Escape') return;
  if (!$('#studentBackdrop').hidden) closeStudentManager();
  else closeModal();
});
document.querySelectorAll('[data-soon]').forEach((button) => button.addEventListener('click', () => toast(`${button.dataset.soon} akan terhubung pada tahap pengembangan berikutnya.`)));
$('#studentNav').addEventListener('click', openStudentManager);
document.querySelector('.main-nav .nav-item[href="#dashboard"]').addEventListener('click', closeStudentManager);
$('#closeStudentButton').addEventListener('click', closeStudentManager);
$('#studentBackdrop').addEventListener('click', (event) => { if (event.target === $('#studentBackdrop')) closeStudentManager(); });
$('#showStudentFormButton').addEventListener('click', () => {
  $('#studentFormPanel').hidden = false;
  updateStudentLocationOptions();
  $('#studentId').focus();
});
$('#cancelStudentFormButton').addEventListener('click', () => {
  $('#studentFormPanel').hidden = true;
  $('#studentForm').reset();
  updateStudentLocationOptions();
});
$('#studentForm').addEventListener('submit', addStudent);
$('#studentSearch').addEventListener('input', renderStudentRows);
$('#studentProvince').addEventListener('change', () => {
  $('#studentCity').value = ''; $('#studentDistrict').value = ''; $('#studentVillage').value = '';
  updateStudentLocationOptions();
});
$('#studentCity').addEventListener('change', () => {
  $('#studentDistrict').value = ''; $('#studentVillage').value = '';
  updateStudentLocationOptions();
});
$('#studentDistrict').addEventListener('change', () => {
  $('#studentVillage').value = '';
  updateStudentLocationOptions();
});
$('#mobileMenu').addEventListener('click', () => $('#sidebar').classList.toggle('open'));
document.addEventListener('click', (event) => {
  if (window.innerWidth <= 680 && $('#sidebar').classList.contains('open') && !$('#sidebar').contains(event.target) && !$('#mobileMenu').contains(event.target)) $('#sidebar').classList.remove('open');
});

try {
  const saved = localStorage.getItem(studentStorageKey);
  if (saved) {
    const parsed = JSON.parse(saved);
    if (Array.isArray(parsed)) {
      state.records = parsed.filter((record) => record && typeof record === 'object').map((record) => ({
        id: normalizeText(record.id), name: normalizeText(record.name), gender: normalizeText(record.gender),
        province: normalizeText(record.province), city: normalizeText(record.city), district: normalizeText(record.district), village: normalizeText(record.village),
        villageType: normalizeText(record.villageType), count: Number.isFinite(Number(record.count)) && Number(record.count) >= 0 ? Number(record.count) : 0,
        countInvalid: false,
      }));
    }
  }
} catch (error) {
  console.warn('Data lokal sebelumnya tidak dapat dibaca.', error);
}
state.isImported = state.records.length > 0;
applyImportedRecords(state.records);
setToday();
renderStudentRows();
render();

