import { useEffect, useState } from "react";
import type { Order } from "../types/order";
import {
  Card,
  CardContent,
  Typography,
  Stack,
  CircularProgress,
  Autocomplete,
  TextField,
} from "@mui/material";
import type { OrderIntakeResponse } from "../types/orderIntakeResponse";
import OrderIntakeItemRow from "./order-intake-item-row";

export default function IntakeConfirmation() {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>();
  const [orders, setOrders] = useState<Order[]>([]);

  const [data, setData] = useState<OrderIntakeResponse | null>(null);

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    const response = await fetch(`${API_URL}/order`, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error("Order fetch failed");
    }

    setOrders(await response.json());
  };

  useEffect(() => {
    if (selectedOrder) {
      loadIntakeConformationData();
    } else {
      setData(null);
    }
  }, [selectedOrder]);

  const loadIntakeConformationData = async () => {
    const response = await fetch(
      `${API_URL}/order/${selectedOrder.id}/intake`,
      {
        method: "GET",
      },
    );

    if (!response.ok) {
      throw new Error("Order fetch failed");
    }

    setData(await response.json());
  };

  return (
    <Card>
      <CardContent>
        <Autocomplete
          options={orders}
          value={selectedOrder}
          onChange={(_, newValue) => setSelectedOrder(newValue)}
          getOptionLabel={(option) => option.name}
          isOptionEqualToValue={(option, value) => option.id === value.id}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Select Your Order"
              placeholder="Search..."
            />
          )}
          fullWidth
          sx={{ marginBottom: 2, marginTop: 2 }}
        />

        {selectedOrder && (
          <Stack>
            <CircularProgress size={24} />
          </Stack>
        )}

        {!selectedOrder && (
          <Typography color="text.secondary">
            Select an order to view scanning status
          </Typography>
        )}

        {data && (
          <Stack spacing={1}>
            <Typography variant="h6">Order Progress</Typography>

            {data.items.map((item) => (
              <OrderIntakeItemRow item={item}/>
            ))}
          </Stack>
        )}
      </CardContent>
    </Card>
  );
}
