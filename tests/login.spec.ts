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

})