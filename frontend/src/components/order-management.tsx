import { useEffect, useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ListAltIcon from "@mui/icons-material/ListAlt";
import UploadOrderExcelDialog from "./upload-order-excel";

interface Order {
  id: number;
  name: string;
}

export default function OrdersPage() {
  const API_URL = import.meta.env.VITE_API_URL;

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [itemsDialogOpen, setItemsDialogOpen] = useState(false);

  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [orderToDelete, setOrderToDelete] = useState<Order | null>(null);

  const [orderName, setOrderName] = useState("");

  const [currentOrder, setCurrentOrder] = useState<Order>();

  useEffect(() => {
    loadOrders();
  }, []);

  async function loadOrders() {
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/order`);

      if (!response.ok) {
        throw new Error("Failed to load orders.");
      }

      const data = await response.json();

      setOrders(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  function openCreateDialog() {
    setEditingOrder(null);
    setOrderName("");
    setDialogOpen(true);
  }

  function openEditDialog(order: Order) {
    setEditingOrder(order);
    setOrderName(order.name);
    setDialogOpen(true);
  }

  function openItemsDialog(order: Order) {
    setCurrentOrder(order);

    setItemsDialogOpen(true);
  }

  async function saveOrder() {
    try {
      if (editingOrder == null) {
        await fetch(`${API_URL}/order`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: orderName,
          }),
        });
      } else {
        await fetch(`${API_URL}/order/${editingOrder.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: editingOrder.id,
            name: orderName,
          }),
        });
      }

      setDialogOpen(false);

      await loadOrders();
    } catch (err) {
      console.error(err);
    }
  }

  function openDeleteDialog(order: Order) {
    setOrderToDelete(order);
    setDeleteOpen(true);
  }

  async function deleteOrder() {
    if (!orderToDelete) return;

    try {
      await fetch(`${API_URL}/order/${orderToDelete.id}`, {
        method: "DELETE",
      });

      setDeleteOpen(false);

      await loadOrders();
    } catch (err) {
      console.error(err);
    }
  }

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          mt: 5,
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="h5">Orders</Typography>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={openCreateDialog}
        >
          New
        </Button>
      </Box>

      <Paper>
        <List>
          {orders.map((order) => (
            <ListItem
              key={order.id}
              divider
              secondaryAction={
                <>
                  <IconButton onClick={() => openItemsDialog(order)}>
                    <ListAltIcon />
                  </IconButton>

                  <IconButton onClick={() => openEditDialog(order)}>
                    <EditIcon />
                  </IconButton>

                  <IconButton
                    color="error"
                    onClick={() => openDeleteDialog(order)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </>
              }
            >
              <ListItemText primary={order.name} />
            </ListItem>
          ))}
        </List>
      </Paper>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} fullWidth>
        <DialogTitle>{editingOrder ? "Edit Order" : "New Order"}</DialogTitle>

        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Order Name"
            fullWidth
            value={orderName}
            onChange={(e) => setOrderName(e.target.value)}
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>

          <Button
            variant="contained"
            onClick={saveOrder}
            disabled={!orderName.trim()}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={deleteOpen} onClose={() => setDeleteOpen(false)}>
        <DialogTitle>Delete Order?</DialogTitle>

        <DialogContent>
          <Typography>
            Are you sure you want to delete{" "}
            <strong>{orderToDelete?.name}</strong>?
          </Typography>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setDeleteOpen(false)}>Cancel</Button>

          <Button color="error" variant="contained" onClick={deleteOrder}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <UploadOrderExcelDialog open={itemsDialogOpen} onClose={() => setItemsDialogOpen(false)} order={currentOrder} />
    </>
  );
}
