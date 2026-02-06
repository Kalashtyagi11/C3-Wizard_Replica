import { useEffect, useState, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, CardBody, Table, Alert, Button } from 'reactstrap';
import ReactToPdf, { Margin, usePDF } from 'react-to-pdf';

// import * as signalR from '@microsoft/signalr';
import DashboardService from '../../../service/dashboard/Dashboard';

const Success = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const payerID = searchParams.get('PayerID');
  const [paymentData, setPaymentData] = useState(null);
  const [error, setError] = useState(null);

  const getDataHandlerSuccess = async () => {
    try {
      const res = await DashboardService.paymentResponse({ token, payerID });
      if (res && res.data) {
        console.log('test', res.data.data);
        setPaymentData(res.data.data);
      }
    } catch (err) {
      setError('Error fetching payment response');
      console.log('Error fetching payment response:', err);
    }
  };

  const getDataHandlerFailed = async () => {
    try {
      const res = await DashboardService.paymentResponseCancel({ token });
      if (res && res.data) {
        setPaymentData(res.data.data);
      }
    } catch (err) {
      setError('Error fetching payment response');
      console.log('Error fetching payment response:', err);
    }
  };
  const navigate = useNavigate();
  const printRef = useRef();

  const { toPDF, targetRef } = usePDF({
    filename: 'TransactionReceipt.pdf',
    page: { margin: Margin.SMALL, orientation: 'landscape' },
  });

  useEffect(() => {
    if (token && payerID) {
      getDataHandlerSuccess();
    } else if (token) {
      getDataHandlerFailed();
    }
  }, [token, payerID]);

  //     const [message, setMessage] = useState("");

  //   useEffect(() => {
  //
  //   const connection = new signalR.HubConnectionBuilder()
  //     .withUrl("https://localhost:7178/EmailVerified", {
  //       withCredentials: true
  //     })
  //     .withAutomaticReconnect()
  //     .build();

  //   connection.on("EmailVerified", (email, status) => {
  //     console.log("Received", email, status);
  //   });

  //   connection.onclose(error1 => {
  //     console.log("Disconnected", error1);
  //     alert("Disconnected from server");
  //   });

  //   connection.onreconnected(id => {
  //     console.log("Reconnected", id);
  //     alert("Connection re-established");
  //   });

  //   connection.start()
  //     .then(() => console.log("SignalR connected"))
  //     .catch(err => console.error("Connection error:", err));

  //   return () => {
  //     connection.stop();
  //   };
  // }, []);

  return (
    <>
      {/* <h3>Test :{message}</h3> */}
      <div ref={targetRef}>
        <Card
          className="shadow-sm border-0 p-4"
          style={{ maxWidth: '700px', margin: 'auto', fontSize: '1.2rem' }}
        >
          <CardBody>
            <h1 className="text-success text-center mb-4" style={{ fontSize: '2rem' }}>
              Payment Receipt
            </h1>
            {error && (
              <Alert color="danger" className="text-center" style={{ fontSize: '1.2rem' }}>
                {error}
              </Alert>
            )}
            {paymentData ? (
              <Table bordered striped className="text-lg" style={{ fontSize: '1.3rem' }}>
                <tbody>
                  <tr>
                    <th className="p-4">Transaction ID</th>
                    <td className="p-4">{paymentData.paymentGatewayTransactionID}</td>
                  </tr>
                  <tr>
                    <th className="p-4">Payer ID</th>
                    <td className="p-4">{paymentData.paymentPayerId}</td>
                  </tr>
                  <tr>
                    <th className="p-4">Amount</th>
                    <td className="p-4">
                      {paymentData.paymentAmount} {paymentData.currency}
                    </td>
                  </tr>
                  <tr>
                    <th className="p-4">Status</th>
                    <td className="p-4 text-success font-weight-bold">
                      {paymentData.paymentStatus}
                    </td>
                  </tr>
                  <tr>
                    <th className="p-4">Customer Name</th>
                    <td className="p-4">{paymentData.refCustomerName}</td>
                  </tr>
                </tbody>
              </Table>
            ) : (
              <p className="text-center text-muted fs-4">Loading payment details...</p>
            )}
          </CardBody>
        </Card>
      </div>
      <div>
        <Card
          className="shadow-sm border-0 p-4 pt-0"
          style={{ maxWidth: '700px', margin: 'auto', fontSize: '1.2rem' }}
        >
          <CardBody>
            <Button color="success" onClick={toPDF}>
              Download
            </Button>
            <Button color="success" onClick={() => navigate('/apps/dashboard')}>
              Go To DashBoard
            </Button>
          </CardBody>
        </Card>
      </div>
    </>
  );
};

export default Success;
