// Dependencies
import * as React from 'react';
import type {
  AfterpayClearpay as AfterpayClearpayInterface,
  AfterpayButtonOptions,
  AfterpayShippingContactCallback,
  AfterpayShippingOptionCallback,
  SqEvent,
} from '@square/web-payments-sdk-types';

// Internals
import { useForm } from '@/contexts';
import { useEventListener } from '@/hooks';

const defaultProps: AfterpayButtonOptions = {
  buttonColor: 'black',
};

export interface AfterpayClearpayProps extends AfterpayButtonOptions {
  /**
   * Callback function that is called when the shipping contact is selected.
   */
  shippingAddressChanged?(
    event: SqEvent<AfterpayShippingContactCallback>
  ): void;
  /**
   * Callback function that is called when the payment form detected a new likely credit card brand
   * based on the card number.
   */
  shippingOptionChanged?(event: SqEvent<AfterpayShippingOptionCallback>): void;
}
/**
 * Renders a Afterpay button to use in the Square Web Payment SDK, pre-styled to meet Afterpay's branding guidelines.
 *
 * **Remember** that you need to set `createPaymentRequest()` in `SquareForm`
 * if you going to use this Payment Method
 *
 * @example
 * ```tsx
 * <SquareForm {...props}>
 *  <AfterpayClearpay buttonColor="white" />
 * </SquareForm>
 * ```
 */
export const AfterpayClearpay = ({
  shippingAddressChanged,
  shippingOptionChanged,
  ...props
}: AfterpayClearpayProps): JSX.Element | null => {
  const [afterpayClearpay, setAfterpayClearpay] = React.useState<
    AfterpayClearpayInterface | undefined
  >(() => undefined);
  const {
    cardTokenizeResponseReceived,
    createPaymentRequest,
    payments,
  } = useForm();
  const divRef = React.useRef<HTMLDivElement>(null);

  if (!createPaymentRequest) {
    throw new Error(
      '`createPaymentRequest()` is required when using digital wallets'
    );
  }

  /**
   * Handle the on click of the Afterpay button click
   *
   * @param e An event which takes place in the DOM.
   * @returns The data be sended to `cardTokenizeResponseReceived()` function, or an error
   */
  const handlePayment = async (e: Event) => {
    e.preventDefault();

    try {
      const result = await afterpayClearpay?.tokenize();

      if (result) {
        return cardTokenizeResponseReceived(result);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Avoid re-rendering the component when the afterpay is not ready
  const afterpayClearpayProps =
    Object.keys(props).length > 1 ? props : undefined;
  React.useEffect(() => {
    /**
     * Initialize the Afterpay instance to be used in the component
     */
    const start = async () => {
      const paymentRequest = payments?.paymentRequest(createPaymentRequest);
      const afterpayClearpay = await payments
        // @ts-ignore - PaymentRequest is defined in the types
        ?.afterpayClearpay(paymentRequest)
        .then((res: any) => {
          setAfterpayClearpay(res);

          return res;
        });

      const options = { ...defaultProps, ...afterpayClearpayProps };
      await afterpayClearpay?.attach('#afterpay-clearpay-button', options);
    };

    start();
  }, [createPaymentRequest, payments]);

  useEventListener({
    listener: handlePayment,
    type: 'click',
    element: divRef,
    options: {
      passive: true,
    },
  });

  if (shippingAddressChanged) {
    afterpayClearpay?.addEventListener(
      'afterpay_shippingaddresschanged',
      shippingAddressChanged
    );
  }
  if (shippingOptionChanged) {
    afterpayClearpay?.addEventListener(
      'afterpay_shippingoptionchanged',
      shippingOptionChanged
    );
  }

  return (
    <div
      id="afterpay-clearpay-button"
      ref={divRef}
      style={{ height: 40 }}
    ></div>
  );
};

export default AfterpayClearpay;
