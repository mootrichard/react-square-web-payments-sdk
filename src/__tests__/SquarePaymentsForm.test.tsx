// Dependencies
import * as React from 'react';
import { cleanup, render, screen } from '@testing-library/react';

// Internals
import FormProvider from '@/contexts';
import { paymentsSdk } from './__mocks__/paymentsSdk';
import type { ProviderProps } from '@/contexts';

describe('SquarePaymentsForm', () => {
  const renderForm = async (
    children: React.ReactNode,
    props: ProviderProps
  ) => {
    cleanup();

    const view = render(
      <FormProvider {...props}>
        <div data-testid="rswps-form" id="web-payment-sdk-form">
          {children}
        </div>
      </FormProvider>
    );

    const form = await screen.findByTestId('rswps-form');

    return { view, form };
  };

  it('should render without crashing', async () => {
    const { form } = await renderForm(null, {
      cardTokenizeResponseReceived: (token, verfiedBuyer) => {
        console.info(token, verfiedBuyer);
      },
      payments: paymentsSdk,
    });

    expect(form).toBeInTheDocument();
  });
});
