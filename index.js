const NF = new Intl.NumberFormat();
const sizes = {
  small: {
    tiny: 8,
    small: 10,
    medium: 12,
    large: 14,
    hPadding: 10,
    vPadding: 10,
  },
  medium: {
    tiny: 12,
    small: 14,
    medium: 18,
    large: 24,
    hPadding: 18,
    vPadding: 2,
  },
  large: {
    tiny: 16,
    small: 20,
    medium: 26,
    large: 32,
    hPadding: 20,
    vPadding: 16,
  },
};
const currentSize = sizes[config.widgetFamily] || sizes.large;

const covidData = await fetchCovidDataFromEasySunday();
formatNumbersWithNumberSigns(covidData, [
  'newConfirmed',
  'newDeaths',
  'newHospitalized',
]);
async function fetchCovidDataFromThStat() {
  let url = 'https://covid19.th-stat.com/json/covid19v2/getTodayCases.json';
  const req = new Request(url);
  const response = await req.loadJSON();
  return {
    newConfirmed: response.NewConfirmed,
    confirmed: response.Confirmed,
    newDeaths: response.NewDeaths,
    deaths: response.Deaths,
    updateDate: response.UpdateDate,
    recovered: response.Recovered,
    hospitalized: response.Hospitalized,
    newHospitalized: response.NewHospitalized,
  };
}

async function fetchCovidDataFromEasySunday() {
  let url = 'https://static.easysunday.com/covid-19/getTodayCases.json';
  const req = new Request(url);
  const response = await req.loadJSON();
  const ret = {
    newConfirmed: response.NewConfirmed,
    confirmed: response.Confirmed,
    newDeaths: response.NewDeaths,
    deaths: response.Deaths,
    updateDate: response.UpdateDate,
    recovered: response.Recovered,
    hospitalized: response.Hospitalized,
    newHospitalized: response.NewHospitalized,
  };
  return ret;
}

function formatNumbersWithNumberSigns(obj, keys) {
  keys.forEach((k) => {
    const v = obj[k];
    if (Number(v) > 0) {
      obj[k] = `+${v}`;
    }
  });
}

const widget = new ListWidget();
widget.backgroundColor = Color.black();
await createHeader();
widget.addSpacer(currentSize.hPadding);
let row1 = await widget.addStack();
row1.layoutHorizontally();
await addItem(row1, {
  label: {
    value: 'ยอดวันนี้',
    style: 'light',
    fontSize: currentSize.medium,
    color: '#FFFFFF',
  },
  value: {
    value: covidData.newConfirmed,
    style: 'bold-mono',
    fontSize: currentSize.large,
    color: '#FF0000',
  },
});
widget.addSpacer(currentSize.vPadding);

let row2 = await widget.addStack();
await addItem(row2, {
  label: {
    value: 'เสียชีวิตวันนี้',
    style: 'light',
    fontSize: currentSize.small,
    color: '#FFFFFF',
  },
  value: {
    value: covidData.newDeaths,
    style: 'bold',
    fontSize: currentSize.medium,
    color: '#FF76FF',
  },
});
row2.addSpacer();
await addItem(row2, {
  label: {
    value: 'รับการรักษาเพิ่ม',
    style: 'light',
    fontSize: currentSize.small,
    color: '#FFFFFF',
  },
  value: {
    value: covidData.newHospitalized,
    style: 'bold',
    fontSize: currentSize.medium,
    color: '#FEFB67',
  },
});
row2.addSpacer();
widget.addSpacer(currentSize.vPadding);

if (config.widgetFamily !== 'medium') {
  let row3 = await widget.addStack();
  row3.layoutHorizontally();
  await addItem(row3, {
    label: {
      value: 'ติดเชื้อทั้งหมด',
      style: 'light',
      fontSize: currentSize.tiny,
      color: '#FFFFFF',
    },
    value: {
      value: covidData.confirmed,
      style: 'regular',
      fontSize: currentSize.small,
      color: '#FF6D67',
    },
  });
  row3.addSpacer();
  await addItem(row3, {
    label: {
      value: 'เสียชีวิตรวม',
      style: 'light',
      fontSize: currentSize.tiny,
      color: '#FFFFFF',
    },
    value: {
      value: covidData.deaths,
      style: 'regular',
      fontSize: currentSize.small,
      color: '#FF6D67',
    },
  });
  row3.addSpacer();
  await addItem(row3, {
    label: {
      value: 'รักษาอยู่',
      style: 'light',
      fontSize: currentSize.tiny,
      color: '#FFFFFF',
    },
    value: {
      value: covidData.hospitalized,
      style: 'regular',
      fontSize: currentSize.small,
      color: '#FF6D67',
    },
  });
  row3.addSpacer();
}

widget.setPadding(
  currentSize.hPadding,
  currentSize.hPadding,
  currentSize.hPadding,
  currentSize.hPadding
);
widget.url = 'https://soontobeprogrammer.com/posts/covid-ios-widget/';
if (config.runsInApp) {
  await widget.presentLarge();
}
Script.setWidget(widget);
Script.complete();

async function createHeader() {
  let icon = widget.addStack();
  const coin = await getImage('http://soontobeprogrammer.com/thailand.png');
  if (coin) {
    const coinImg = icon.addImage(coin);
    coinImg.imageSize = new Size(currentSize.large, currentSize.large);
  }
  icon.layoutHorizontally();
  icon.addSpacer(8);
  let iconRow = icon.addStack();
  iconRow.layoutVertically();
  let iconText = iconRow.addStack();
  let line1 = iconText.addText(
    'COVID Thailand ' + covidData.updateDate.substring(0, 5)
  );
  line1.font = Font.mediumRoundedSystemFont(currentSize.small);
  line1.textColor = new Color('#FFFFFF');
  let line2 = iconRow.addText('scriptable by SaKKo sama');
  line2.font = Font.lightRoundedSystemFont(currentSize.tiny);
  line2.textColor = new Color('#FFFFFF');
  line2.leftAlignText();
}

async function addItem(_row, _item) {
  let itemRow = _row.addStack();
  let line1 = itemRow.addText(_item.label.value.toString());
  await setStyle(
    line1,
    _item.label.style,
    _item.label.fontSize,
    _item.label.color
  );
  itemRow.layoutVertically();
  itemRow.addSpacer(2);
  let val = _item.value.value;
  if (Number(val) && Number(val) > 0) {
    val = NF.format(val);
    if (_item.value.value.toString().includes('+')) {
      val = '+' + val;
    }
  }
  let line2 = itemRow.addText(val.toString());
  await setStyle(
    line2,
    _item.value.style,
    _item.value.fontSize,
    _item.value.color
  );
}

async function setStyle(obj, style, fontSize, color) {
  if (style === 'light-mono') {
    obj.font = Font.lightMonospacedSystemFont(fontSize);
  } else if (style === 'medium-mono') {
    obj.font = Font.mediumMonospacedSystemFont(fontSize);
  } else if (style === 'regular-mono') {
    obj.font = Font.regularMonospacedSystemFont(fontSize);
  } else if (style === 'bold-mono') {
    obj.font = Font.boldMonospacedSystemFont(fontSize);
  } else if (style === 'light-round') {
    obj.font = Font.lightRoundedSystemFont(fontSize);
  } else if (style === 'medium-round') {
    obj.font = Font.mediumRoundedSystemFont(fontSize);
  } else if (style === 'regular-round') {
    obj.font = Font.regularRoundedSystemFont(fontSize);
  } else if (style === 'bold-round') {
    obj.font = Font.boldRoundedSystemFont(fontSize);
  } else if (style === 'light') {
    obj.font = Font.lightSystemFont(fontSize);
  } else if (style === 'medium') {
    obj.font = Font.mediumSystemFont(fontSize);
  } else if (style === 'regular') {
    obj.font = Font.regularSystemFont(fontSize);
  } else if (style === 'bold') {
    obj.font = Font.boldSystemFont(fontSize);
  }
  if (color) {
    obj.textColor = new Color(color);
  }
}

async function getImage(imageUrl) {
  try {
    let fm = FileManager.local();
    let dir = fm.documentsDirectory();
    let imgSplit = imageUrl.split('/');
    let path = fm.joinPath(dir, imgSplit[imgSplit.length - 1]);
    if (fm.fileExists(path)) {
      return fm.readImage(path);
    } else {
      let iconImage = await loadImage(imageUrl);
      fm.writeImage(path, iconImage);
      return iconImage;
    }
  } catch (e) {
    console.log(e);
  }
}

async function loadImage(imgUrl) {
  const req = new Request(imgUrl);
  return await req.loadImage();
}

// Icons made by https://www.flaticon.com/authors/surang from https://www.flaticon.com/
