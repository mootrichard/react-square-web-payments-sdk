// Dependencies
import * as React from 'react';

// Internals
import { AfterpayClearpay, SquarePaymentsForm } from '@/components';
import type { AfterpayClearpayProps } from '@/components';

export const Example: React.FC<AfterpayClearpayProps> = (props) => {
  return (
    <SquarePaymentsForm
      /**
       * This is a sandbox application ID. You can find your application ID in the Square Dashboard.
       *
       * You will not be charged using this credentials
       */
      applicationId="sandbox-sq0idb-B-i4MbEZEARTWqSj7Gs9Ww"
      cardTokenizeResponseReceived={(token, buyer) => {
        console.info({ token, buyer });
      }}
      createPaymentRequest={() => ({
        countryCode: 'US',
        currencyCode: 'USD',
        total: { amount: '5.79', label: 'Total' },
        requestShippingContact: true,
      })}
      createVerificationDetails={() => ({
        amount: '1.00',
        /* collected from the buyer */
        billingContact: {
          addressLines: ['123 Main Street', 'Apartment 1'],
          familyName: 'Doe',
          givenName: 'John',
          countryCode: 'GB',
          city: 'London',
        },
        currencyCode: 'GBP',
        intent: 'CHARGE',
      })}
      /**
       * This is a sandbox location ID. You can find your location ID in the Square Dashboard > Locations.
       *
       * You will not be charged using this credentials
       */
      locationId="9PKBD3JCQFH0D"
    >
      <AfterpayClearpay {...props} />
    </SquarePaymentsForm>
  );
};
