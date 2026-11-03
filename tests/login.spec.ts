import { test, expect } from '@mobilewright/test';
import * as allure from 'allure-js-commons';

test('app launches and shows the product list', async ({ screen }) => {
  await expect(screen.getByText('Products')).toBeVisible();
});

test('click on the hamburger menu and login', async({screen})=>{
  await allure.feature('Login');
  await screen.getByLabel('View menu').tap();
  await screen.getByRole('text', { name: 'Login Menu Item' }).tap();
  await screen.getByTestId('com.saucelabs.mydemoapp.android:id/nameET').fill('bod@example.com');
  await screen.getByTestId('com.saucelabs.mydemoapp.android:id/passwordET').fill('10203040');
  await screen.getByTestId('com.saucelabs.mydemoapp.android:id/loginBtn').tap();
  await expect(screen.getByText('Products')).toBeVisible();

})
test('click on the product and completes the checkout process', async({screen})=>{
  const backpackImage = screen.getByTestId('com.saucelabs.mydemoapp.android:id/productIV').nth(0);
  await backpackImage.tap();

  await screen.getByTestId('com.saucelabs.mydemoapp.android:id/cartBt').tap();
  await screen.getByTestId('com.saucelabs.mydemoapp.android:id/cartIV').tap();
  await screen.getByTestId('com.saucelabs.mydemoapp.android:id/cartBt').tap();

  await screen.getByTestId('com.saucelabs.mydemoapp.android:id/username1TV').tap();
  await screen.getByTestId('com.saucelabs.mydemoapp.android:id/loginBtn').tap();

  const fullName = screen.getByTestId('com.saucelabs.mydemoapp.android:id/fullNameET');
  await expect(fullName).toBeVisible();
  await fullName.fill('John Doe');

   const address = screen.getByTestId('com.saucelabs.mydemoapp.android:id/address1ET');
  await expect(address).toBeVisible();
  await address.fill('123 Main St');

  const city = screen.getByTestId('com.saucelabs.mydemoapp.android:id/cityET');
  await expect(city).toBeVisible();
  await city.fill('Chennai');

  const zipcode = screen.getByTestId('com.saucelabs.mydemoapp.android:id/zipET');
  await expect(zipcode).toBeVisible();
  await zipcode.fill('12345');

  const country = screen.getByTestId('com.saucelabs.mydemoapp.android:id/countryET');
  await expect(country).toBeVisible();
  await country.fill('India');

  await screen.getByTestId('com.saucelabs.mydemoapp.android:id/paymentBtn').tap();

  await expect(screen.getByText('Checkout')).toBeVisible();

 const name = screen.getByTestId('com.saucelabs.mydemoapp.android:id/nameET');
  await expect(name).toBeVisible();
  await name.fill('John Doe');

  const cardnum = screen.getByTestId('com.saucelabs.mydemoapp.android:id/cardNumberET');
  // test.setTimeout(120000);
  await expect(cardnum).toBeVisible();
  await cardnum.fill('1234567890123456');

  const expiry = screen.getByTestId('com.saucelabs.mydemoapp.android:id/expirationDateET');
  await expect(expiry).toBeVisible();
  await expiry.fill('12/25');

  const securityCode = screen.getByTestId('com.saucelabs.mydemoapp.android:id/securityCodeET');
  await expect(securityCode).toBeVisible();
  await securityCode.fill('123');

  await screen.getByTestId('com.saucelabs.mydemoapp.android:id/paymentBtn').tap();
  await screen.getByTestId('com.saucelabs.mydemoapp.android:id/paymentBtn').tap();
  await screen.getByTestId('com.saucelabs.mydemoapp.android:id/shoopingBt').tap();
  await expect(screen.getByText('Products')).toBeVisible();

})

