// Dependencies
import * as React from 'react'
import { payments } from '@square/web-sdk'
import type * as Square from '@square/web-sdk'

// Internals
import FormProvider from './contexts/FormContext'
import { ErrorScreen } from './components/ErrorScreen'

interface SquarePaymentsFormProps {
  /**
   * **Required for all features**
   *
   * Identifies the calling form with a verified application ID generated from the Square Application Dashboard.
   */
  applicationId: string
  /**
   * **Required for all features**
   *
   * Identifies the location of the merchant that is taking the payment. Obtained from the Square Application Dashboard - Locations tab.
   */
  locationId: string
  /** Identifies the DOM form element. */
  formId?: string
  /** Square payment form components. */
  children?: React.ReactNode

  /**
   * **Required for all features**
   *
   * Invoked when payment form receives the result of a tokenize generation request. The result will be a valid credit card or wallet token, or an error.
   */
  cardTokenizeResponseReceived: (
    props: Square.TokenResult,
    verifiedBuyer?: Square.VerifyBuyerResponseDetails | null
  ) => void
  /** **Required for digital wallets**
   *
   * Invoked when a digital wallet payment button is clicked.
   */
  createPaymentRequest?: () => Square.PaymentRequestOptions
  /** **Required for SCA** */
  createVerificationDetails?: () =>
    | Square.ChargeVerifyBuyerDetails
    | Square.StoreVerifyBuyerDetails
}

const SquarePaymentsForm = ({
  applicationId,
  locationId,
  formId = 'web-payment-sdk-form',
  ...props
}: SquarePaymentsFormProps): React.ReactElement | null => {
  const [paymentsSdk, setPaymentsSdk] = React.useState<Square.Payments>()

  React.useEffect(() => {
    async function loadPayment(): Promise<void> {
      await payments(applicationId, locationId).then((res) => {
        if (res === null) {
          throw new Error('Square Web Payments SDK failed to load')
        }

        setPaymentsSdk(res)

        return res
      })
    }

    if (applicationId && locationId) {
      loadPayment()
    }
  }, [applicationId, locationId])

  if (!applicationId || !locationId) {
    return <ErrorScreen />
  }

  if (!paymentsSdk) {
    return null
  }

  return (
    <FormProvider
      cardTokenizeResponseReceived={props.cardTokenizeResponseReceived}
      createPaymentRequest={props.createPaymentRequest}
      createVerificationDetails={props.createVerificationDetails}
      payments={paymentsSdk}
    >
      <div data-testid="rswps-form" id={formId}>
        {props.children}
      </div>
    </FormProvider>
  )
}

export { SquarePaymentsForm }
export type { SquarePaymentsFormProps }