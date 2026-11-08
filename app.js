/* SANTRIPEDIA dashboard preview. Imported workbooks are read locally in the browser. */
const demoRecords = [
  { id: 'DEMO-0001', province: 'Jawa Barat', city: 'Kota Bandung', district: 'Cicendo', village: 'Sukaraja', villageType: 'Kelurahan', count: 1000 },
  { id: 'DEMO-0002', province: 'Jawa Barat', city: 'Kota Bandung', district: 'Cicendo', village: 'Arjuna', villageType: 'Kelurahan', count: 1000 },
  { id: 'DEMO-0003', province: 'Jawa Barat', city: 'Kota Bandung', district: 'Cicendo', village: 'Pamoyanan', villageType: 'Kelurahan', count: 1000 },
  { id: 'DEMO-0004', province: 'Jawa Barat', city: 'Kota Bandung', district: 'Cicendo', village: 'Pasirkaliki', villageType: 'Kelurahan', count: 2000 },
  { id: 'DEMO-0005', province: 'Jawa Barat', city: 'Kota Bandung', district: 'Coblong', village: 'Dago', villageType: 'Kelurahan', count: 2500 },
  { id: 'DEMO-0006', province: 'Jawa Barat', city: 'Kota Bandung', district: 'Coblong', village: 'Lebak Gede', villageType: 'Kelurahan', count: 1500 },
  { id: 'DEMO-0007', province: 'Jawa Barat', city: 'Kota Bandung', district: 'Regol', village: 'Balonggede', villageType: 'Kelurahan', count: 4000 },
  { id: 'DEMO-0008', province: 'Jawa Barat', city: 'Kota Bandung', district: 'Sumur Bandung', village: 'Merdeka', villageType: 'Kelurahan', count: 4000 },
  { id: 'DEMO-0009', province: 'Jawa Barat', city: 'Kabupaten Bogor', district: 'Cibinong', village: 'Cibinong', villageType: 'Kelurahan', count: 5000 },
  { id: 'DEMO-0010', province: 'Jawa Barat', city: 'Kabupaten Bogor', district: 'Ciawi', village: 'Ciawi', villageType: 'Desa', count: 4000 },
  { id: 'DEMO-0011', province: 'Jawa Barat', city: 'Kota Bekasi', district: 'Bekasi Selatan', village: 'Pekayon Jaya', villageType: 'Kelurahan', count: 3200 },
  { id: 'DEMO-0012', province: 'Jawa Barat', city: 'Kota Bekasi', district: 'Mustika Jaya', village: 'Mustikajaya', villageType: 'Kelurahan', count: 2800 },
  { id: 'DEMO-0013', province: 'Jawa Barat', city: 'Kabupaten Garut', district: 'Tarogong Kidul', village: 'Sukagalih', villageType: 'Desa', count: 2000 },
  { id: 'DEMO-0014', province: 'Jawa Barat', city: 'Kabupaten Garut', district: 'Wanaraja', village: 'Wanaraja', villageType: 'Desa', count: 2000 },
  { id: 'DEMO-0015', province: 'Jawa Barat', city: 'Kabupaten Cirebon', district: 'Sumber', village: 'Sumber', villageType: 'Kelurahan', count: 2200 },
  { id: 'DEMO-0016', province: 'Jawa Barat', city: 'Kabupaten Cirebon', district: 'Kedawung', village: 'Kedawung', villageType: 'Desa', count: 1800 },
  { id: 'DEMO-0017', province: 'Banten', city: 'Kota Tangerang', district: 'Cipondoh', village: 'Cipondoh', villageType: 'Kelurahan', count: 4000 },
  { id: 'DEMO-0018', province: 'Banten', city: 'Kota Tangerang', district: 'Tangerang', village: 'Sukarasa', villageType: 'Kelurahan', count: 3000 },
  { id: 'DEMO-0019', province: 'Banten', city: 'Kota Tangerang Selatan', district: 'Pamulang', village: 'Pamulang Barat', villageType: 'Kelurahan', count: 3000 },
  { id: 'DEMO-0020', province: 'Banten', city: 'Kota Tangerang Selatan', district: 'Ciputat', village: 'Ciputat', villageType: 'Kelurahan', count: 2000 },
  { id: 'DEMO-0021', province: 'Jawa Tengah', city: 'Kota Semarang', district: 'Tembalang', village: 'Tembalang', villageType: 'Kelurahan', count: 7000 },
  { id: 'DEMO-0022', province: 'Jawa Tengah', city: 'Kota Semarang', district: 'Banyumanik', village: 'Padangsari', villageType: 'Kelurahan', count: 5000 },
  { id: 'DEMO-0023', province: 'Jawa Tengah', city: 'Kota Surakarta', district: 'Banjarsari', village: 'Nusukan', villageType: 'Kelurahan', count: 6000 },
  { id: 'DEMO-0024', province: 'Jawa Tengah', city: 'Kabupaten Banyumas', district: 'Purwokerto Selatan', village: 'Karangklesem', villageType: 'Kelurahan', count: 8000 },
  { id: 'DEMO-0025', province: 'Jawa Timur', city: 'Kota Surabaya', district: 'Wonokromo', village: 'Darmo', villageType: 'Kelurahan', count: 10000 },
  { id: 'DEMO-0026', province: 'Jawa Timur', city: 'Kota Surabaya', district: 'Sukolilo', village: 'Keputih', villageType: 'Kelurahan', count: 8000 },
  { id: 'DEMO-0027', province: 'Jawa Timur', city: 'Kota Malang', district: 'Lowokwaru', village: 'Dinoyo', villageType: 'Kelurahan', count: 9000 },
  { id: 'DEMO-0028', province: 'Jawa Timur', city: 'Kabupaten Jember', district: 'Kaliwates', village: 'Kepatihan', villageType: 'Kelurahan', count: 7000 },
  { id: 'DEMO-0029', province: 'DKI Jakarta', city: 'Kota Jakarta Selatan', district: 'Jagakarsa', village: 'Lenteng Agung', villageType: 'Kelurahan', count: 6000 },
  { id: 'DEMO-0030', province: 'DKI Jakarta', city: 'Kota Jakarta Timur', district: 'Cakung', village: 'Penggilingan', villageType: 'Kelurahan', count: 5000 },
  { id: 'DEMO-0031', province: 'DKI Jakarta', city: 'Kota Jakarta Barat', district: 'Kebon Jeruk', village: 'Kedoya Selatan', villageType: 'Kelurahan', count: 4000 },
];

const fields = {
  province: { select: 'provinceSelect', label: 'Provinsi', dataKey: 'province', placeholder: 'Semua Provinsi', chip: 'P' },
  city: { select: 'citySelect', label: 'Kabupaten / Kota', dataKey: 'city', placeholder: 'Semua Kab/Kota', chip: 'K' },
  district: { select: 'districtSelect', label: 'Kecamatan', dataKey: 'district', placeholder: 'Semua Kecamatan', chip: 'C' },
  village: { select: 'villageSelect', label: 'Desa / Kelurahan', dataKey: 'village', placeholder: 'Semua Desa/Kelurahan', chip: 'D' },
};
const hierarchy = ['province', 'city', 'district', 'village'];
const state = { records: demoRecords, isDemo: true, chartExpanded: false, toastTimer: null, search: '' };
const $ = (selector) => document.querySelector(selector);
const formatNumber = (value) => Number(value || 0).toLocaleString('id-ID');
const normalizeText = (value) => String(value ?? '').trim();
const uniqueSorted = (items) => [...new Set(items.map(normalizeText).filter(Boolean))].sort((a, b) => a.localeCompare(b, 'id'));

const provinceSelect = $('#provinceSelect');
const citySelect = $('#citySelect');
const districtSelect = $('#districtSelect');
const villageSelect = $('#villageSelect');
const filterSelects = { province: provinceSelect, city: citySelect, district: districtSelect, village: villageSelect };

function currentFilters() {
  return Object.fromEntries(hierarchy.map((key) => [key, filterSelects[key].value]));
}

function matchesFilters(record, filterValues = currentFilters()) {
  return hierarchy.every((key) => !filterValues[key] || record[key] === filterValues[key]);
}

function filteredRecords() {
  return state.records.filter((record) => matchesFilters(record));
}

function sumRecords(records) {
  return records.reduce((total, record) => total + (Number(record.count) || 1), 0);
}

function groupRecords(records, key, parentKey) {
  const groups = new Map();
  records.forEach((record) => {
    const name = normalizeText(record[key]);
    if (!name) return;
    if (!groups.has(name)) groups.set(name, { name, parent: normalizeText(record[parentKey]), count: 0, level: key });
    groups.get(name).count += Number(record.count) || 1;
  });
  return [...groups.values()].sort((a, b) => b.count - a.count || a.name.localeCompare(b.name, 'id'));
}

function updateSelect(select, placeholder, values, selected) {
  select.replaceChildren(new Option(placeholder, ''));
  values.forEach((value) => select.add(new Option(value, value)));
  select.value = values.includes(selected) ? selected : '';
}

function updateFilterOptions() {
  const filters = currentFilters();
  updateSelect(provinceSelect, fields.province.placeholder, uniqueSorted(state.records.map((record) => record.province)), filters.province);
  const province = provinceSelect.value;
  const cityRows = state.records.filter((record) => !province || record.province === province);
  updateSelect(citySelect, fields.city.placeholder, uniqueSorted(cityRows.map((record) => record.city)), filters.city);
  const city = citySelect.value;
  const districtRows = cityRows.filter((record) => !city || record.city === city);
  updateSelect(districtSelect, fields.district.placeholder, uniqueSorted(districtRows.map((record) => record.district)), filters.district);
  const district = districtSelect.value;
  const villageRows = districtRows.filter((record) => !district || record.district === district);
  updateSelect(villageSelect, fields.village.placeholder, uniqueSorted(villageRows.map((record) => record.village)), filters.village);
}

function activeLevel() {
  const values = currentFilters();
  for (let index = hierarchy.length - 1; index >= 0; index -= 1) {
    if (values[hierarchy[index]]) return hierarchy[index];
  }
  return null;
}

function breakdownConfig() {
  const selected = activeLevel();
  if (!selected) return { key: 'province', parentKey: null, childLevel: 'province', title: 'Santri per Provinsi', tableTitle: 'Daftar Provinsi', parentTitle: 'Indonesia' };
  const index = hierarchy.indexOf(selected);
  if (index === hierarchy.length - 1) return { key: null, childLevel: null, title: 'Wilayah terpilih', tableTitle: 'Rincian wilayah', parentTitle: '' };
  const childLevel = hierarchy[index + 1];
  return {
    key: fields[childLevel].dataKey,
    parentKey: fields[selected].dataKey,
    childLevel,
    title: `Santri per ${fields[childLevel].label}`,
    tableTitle: `Daftar ${fields[childLevel].label}`,
    parentTitle: filtersName(selected),
  };
}

function filtersName(level) { return filterSelects[level].selectedOptions[0]?.textContent || ''; }

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
    crumbs.push('<span class="crumb-sep">/</span>', `<strong>${escapeHtml(values[key])}</strong>`);
  });
  crumbContainer.innerHTML = crumbs.join('');
}

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]);
}

function renderStats(records) {
  $('#totalStudents').textContent = formatNumber(sumRecords(records));
  const provinceTotal = uniqueSorted(records.map((record) => record.province)).length;
  const cityTotal = uniqueSorted(records.map((record) => record.city)).length;
  const districtTotal = uniqueSorted(records.map((record) => record.district)).length;
  $('#provinceCount').textContent = formatNumber(provinceTotal);
  $('#cityCount').textContent = formatNumber(cityTotal);
  $('#districtCount').textContent = formatNumber(districtTotal);
  const provinceFilter = provinceSelect.value;
  $('#provinceContext').textContent = provinceFilter ? 'provinsi dalam pilihan' : 'dengan data santri';
}

function makeBreakdown(records, config) {
  if (!config.key) {
    const level = activeLevel();
    const selected = filterSelects[level]?.value;
    return selected ? [{ name: selected, parent: filterSelects[hierarchy[Math.max(0, hierarchy.indexOf(level) - 1)]]?.value || '', count: sumRecords(records), level }] : [];
  }
  if (config.childLevel === 'province') return groupRecords(records, 'province', 'province');
  return groupRecords(records, config.key, config.parentKey);
}

function renderChart(items, config) {
  $('#breakdownTitle').textContent = config.title;
  $('#breakdownSubtitle').textContent = config.childLevel ? 'Area dengan jumlah santri terbanyak' : 'Total santri pada tingkat wilayah terpilih';
  const chart = $('#barChart');
  const sorted = items.slice(0, state.chartExpanded ? 12 : 6);
  if (!items.length) {
    chart.innerHTML = '<div class="chart-empty">Desa atau kelurahan adalah tingkat wilayah terakhir.</div>';
    $('#chartShowing').textContent = 'Tidak ada rincian tingkat di bawahnya';
    $('#showAllButton').style.visibility = 'hidden';
    return;
  }
  const max = Math.max(...items.map((item) => item.count), 1);
  chart.innerHTML = sorted.map((item, index) => {
    const width = Math.max(3, (item.count / max) * 100);
    const filterKey = item.level;
    return `<button class="bar-row" type="button" data-level="${escapeHtml(filterKey)}" data-value="${escapeHtml(item.name)}" aria-label="Lihat ${escapeHtml(item.name)}, ${formatNumber(item.count)} santri"><span class="bar-label">${escapeHtml(item.name)}</span><span class="bar-track"><span class="bar-fill" style="width:${width}%;animation-delay:${index * 45}ms"></span></span><span class="bar-count">${formatNumber(item.count)}</span></button>`;
  }).join('');
  $('#chartShowing').textContent = `Menampilkan ${formatNumber(sorted.length)} dari ${formatNumber(items.length)} wilayah`;
  $('#showAllButton').style.visibility = items.length > 6 ? 'visible' : 'hidden';
  $('#showAllButton').textContent = state.chartExpanded ? 'Tampilkan lebih sedikit ↓' : 'Lihat rincian →';
  chart.querySelectorAll('.bar-row').forEach((button) => button.addEventListener('click', () => drillDown(button.dataset.level, button.dataset.value)));
}

function renderHierarchy(records) {
  const values = currentFilters();
  const nodes = hierarchy.map((key) => ({ key, value: values[key] })).filter((node) => node.value);
  const container = $('#hierarchyList');
  if (!nodes.length) {
    container.innerHTML = hierarchy.map((key) => `<div class="hierarchy-row"><div class="hierarchy-node"><span class="node-dot"></span><span class="node-label"><small>${fields[key].label.toUpperCase()}</small><strong>Semua ${fields[key].label}</strong></span></div><span class="hierarchy-count">${formatNumber(uniqueSorted(records.map((record) => record[fields[key].dataKey])).length)} <span>area</span></span></div>`).join('');
    return;
  }
  container.innerHTML = nodes.map((node) => {
    const matching = records.filter((record) => record[node.key] === node.value);
    const count = sumRecords(matching);
    return `<div class="hierarchy-row"><div class="hierarchy-node"><span class="node-dot"></span><span class="node-label"><small>${fields[node.key].label.toUpperCase()}</small><strong>${escapeHtml(node.value)}</strong></span></div><span class="hierarchy-count">${formatNumber(count)} <span>santri</span></span></div>`;
  }).join('');
}

function renderTable(items, config, filteredCount) {
  $('#tableTitle').textContent = config.tableTitle;
  $('#tableSubtitle').textContent = config.childLevel ? `Pilih wilayah untuk menelusuri data hingga tingkat desa atau kelurahan.` : 'Wilayah yang dipilih sudah berada di tingkat desa atau kelurahan.';
  const tbody = $('#areaTableBody');
  const search = state.search.toLocaleLowerCase('id');
  const visibleItems = items.filter((item) => !search || `${item.name} ${item.parent}`.toLocaleLowerCase('id').includes(search));
  if (!visibleItems.length) {
    const message = search ? 'Tidak ada wilayah yang cocok dengan pencarian.' : 'Tidak ada rincian wilayah pada pilihan ini.';
    tbody.innerHTML = `<tr><td colspan="6" class="empty-row">${message}</td></tr>`;
    $('#tableSummary').textContent = search ? '0 hasil pencarian' : 'Tidak ada tingkat wilayah lanjutan';
    return;
  }
  const total = sumRecords(items);
  tbody.innerHTML = visibleItems.map((item, index) => {
    const share = total ? (item.count / total) * 100 : 0;
    const level = item.level || config.childLevel || activeLevel() || 'province';
    const parent = item.parent || config.parentTitle || 'Indonesia';
    const chip = fields[level]?.chip || 'W';
    const chipClass = level === 'city' ? 'city' : level === 'district' ? 'district' : level === 'village' ? 'village' : '';
    return `<tr>
      <td class="rank-col"><span class="rank-num">${String(index + 1).padStart(2, '0')}</span></td>
      <td><span class="area-name-cell"><span class="area-chip ${chipClass}">${chip}</span>${escapeHtml(item.name)}</span></td>
      <td class="parent-name">${escapeHtml(parent)}</td>
      <td class="count-cell">${formatNumber(item.count)}</td>
      <td><span class="share-cell"><span class="share-track"><span class="share-fill" style="width:${Math.min(100, share)}%"></span></span><span class="share-value">${share.toLocaleString('id-ID', { maximumFractionDigits: 1 })}%</span></span></td>
      <td><button class="row-open" type="button" data-level="${escapeHtml(level)}" data-value="${escapeHtml(item.name)}" title="Lihat rincian ${escapeHtml(item.name)}" aria-label="Lihat rincian ${escapeHtml(item.name)}"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="m9 18 6-6-6-6"/></svg></button></td>
    </tr>`;
  }).join('');
  tbody.querySelectorAll('.row-open').forEach((button) => button.addEventListener('click', () => drillDown(button.dataset.level, button.dataset.value)));
  $('#tableSummary').textContent = search ? `${formatNumber(visibleItems.length)} dari ${formatNumber(items.length)} wilayah` : `${formatNumber(items.length)} wilayah • ${formatNumber(filteredCount)} santri`;
}

function render() {
  updateFilterOptions();
  const records = filteredRecords();
  const config = breakdownConfig();
  const items = makeBreakdown(records, config);
  renderCrumbs();
  renderStats(records);
  renderChart(items, config);
  renderHierarchy(records);
  renderTable(items, config, sumRecords(records));
  const provinces = uniqueSorted(records.map((record) => record.province)).length;
  $('#recordCountLabel').textContent = state.isDemo ? `Data simulasi • ${provinces} provinsi` : `${formatNumber(records.length)} record ditampilkan`;
  $('#modePill').innerHTML = `<span></span> ${state.isDemo ? 'DATA DEMO' : 'DATA IMPOR'}`;
  $('#tableModeLabel').textContent = state.isDemo ? 'Angka pada pratinjau ini adalah data simulasi' : 'Data dari file yang diimpor • pratinjau lokal';
}

function drillDown(level, value) {
  if (!fields[level]) return;
  const index = hierarchy.indexOf(level);
  filterSelects[level].value = value;
  hierarchy.slice(index + 1).forEach((key) => { filterSelects[key].value = ''; });
  state.search = '';
  $('#tableSearch').value = '';
  render();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function resetFilters() {
  hierarchy.forEach((key) => { filterSelects[key].value = ''; });
  state.search = '';
  state.chartExpanded = false;
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
  if (headerIndex < 0) throw new Error('Header ID Santri dan Provinsi tidak ditemukan. Gunakan template SANTRIPEDIA.');
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
  const count = Number(source['Jumlah Santri'] ?? source['jumlah_santri'] ?? 1);
  return {
    id, province, city, district, village,
    villageType: valueFor('Jenis Wilayah'),
    count: Number.isFinite(count) && count > 0 ? count : 1,
  };
}

async function importFile(file) {
  try {
    let sourceRows;
    if (/\.csv$/i.test(file.name)) sourceRows = parseCsv(await file.text());
    else if (/\.xlsx$/i.test(file.name)) sourceRows = await parseXlsx(file);
    else throw new Error('Gunakan file Excel .xlsx atau CSV.');
    const imported = sourceRows.map(normalizeImportedRow).filter((record) => record.id || record.province || record.city || record.district || record.village);
    if (!imported.length) throw new Error('Tidak ada baris data santri yang dapat dibaca.');
    const missingArea = imported.filter((record) => !record.province || !record.city || !record.district || !record.village).length;
    const ids = imported.map((record) => record.id).filter(Boolean);
    const duplicates = ids.length - new Set(ids).size;
    state.records = imported;
    state.isDemo = false;
    state.chartExpanded = false;
    state.search = '';
    $('#tableSearch').value = '';
    hierarchy.forEach((key) => { filterSelects[key].value = ''; });
    render();
    const notes = [];
    if (missingArea) notes.push(`${formatNumber(missingArea)} baris belum memiliki wilayah lengkap`);
    if (duplicates) notes.push(`${formatNumber(duplicates)} ID ganda, periksa agar jumlah tidak berlebih`);
    toast(`${formatNumber(imported.length)} baris berhasil dibuka${notes.length ? `. Catatan: ${notes.join('; ')}.` : ` dari ${file.name}.`}`);
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

function exportSummary() {
  const records = filteredRecords();
  const config = breakdownConfig();
  const items = makeBreakdown(records, config);
  if (!items.length) { toast('Tidak ada rincian wilayah untuk diekspor.', true); return; }
  const rows = [['Wilayah', 'Wilayah Induk', 'Jumlah Santri', 'Persentase']];
  const total = sumRecords(items);
  items.forEach((item) => rows.push([item.name, item.parent || config.parentTitle || 'Indonesia', item.count, total ? `${((item.count / total) * 100).toFixed(1)}%` : '0%']));
  const csv = `\uFEFF${rows.map((row) => row.map(csvEscape).join(',')).join('\r\n')}`;
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = `santripedia-ringkasan-${new Date().toISOString().slice(0, 10)}.csv`;
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
  render();
}));

$('#resetFilters').addEventListener('click', resetFilters);
$('#importButton').addEventListener('click', () => $('#fileInput').click());
$('#fileInput').addEventListener('change', (event) => { if (event.target.files?.[0]) importFile(event.target.files[0]); });
$('#exportButton').addEventListener('click', exportSummary);
$('#tableExportButton').addEventListener('click', exportSummary);
$('#showAllButton').addEventListener('click', () => { state.chartExpanded = !state.chartExpanded; render(); });
$('#tableSearch').addEventListener('input', (event) => { state.search = event.target.value.trim(); render(); });
$('#helpButton').addEventListener('click', openModal);
$('#aboutLink').addEventListener('click', openModal);
$('#modalClose').addEventListener('click', closeModal);
$('#modalDone').addEventListener('click', closeModal);
$('#modalBackdrop').addEventListener('click', (event) => { if (event.target === $('#modalBackdrop')) closeModal(); });
document.addEventListener('keydown', (event) => { if (event.key === 'Escape') closeModal(); });
document.querySelectorAll('[data-soon]').forEach((button) => button.addEventListener('click', () => toast(`${button.dataset.soon} akan terhubung pada tahap pengembangan berikutnya.`)));
$('#mobileMenu').addEventListener('click', () => $('#sidebar').classList.toggle('open'));
document.addEventListener('click', (event) => {
  if (window.innerWidth <= 680 && $('#sidebar').classList.contains('open') && !$('#sidebar').contains(event.target) && !$('#mobileMenu').contains(event.target)) $('#sidebar').classList.remove('open');
});

setToday();
updateFilterOptions();
provinceSelect.value = state.records.some((record) => record.province === 'Jawa Barat') ? 'Jawa Barat' : '';
render();
