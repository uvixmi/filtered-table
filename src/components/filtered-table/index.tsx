import Table from "@mui/material/Table"
import TableBody from "@mui/material/TableBody"
import TableCell from "@mui/material/TableCell"
import TableContainer from "@mui/material/TableContainer"
import TableHead from "@mui/material/TableHead"
import TableRow from "@mui/material/TableRow"
import ClearIcon from "@mui/icons-material/Clear"
import Paper from "@mui/material/Paper"
import {
  Backdrop,
  Box,
  Button,
  Fade,
  TextField,
  MenuItem,
  Modal,
  Select,
  SelectChangeEvent,
  Typography,
  FormControl,
  InputLabel,
  IconButton,
} from "@mui/material"
import { useEffect, useState } from "react"
import { Pages, PricePlans, Products } from "./mock"
import { CONTENT, SEARCH_FIELDS, TABLE_NAMES } from "./constants"

const style = {
  display: "flex",
  flexDirection: "column",
  position: "absolute" as "absolute",
  gap: "8px",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  height: 200,
  justifyContent: "space-between",
  bgcolor: "background.paper",
  border: "2px solid #1976d2",
  borderRadius: "10px",
  boxShadow: 24,
  p: 4,
}

export const FilteredTable = () => {
  const [open, setOpen] = useState(false)
  const [editText, setEditText] = useState("")
  const [editId, setEditId] = useState(0)
  const handleOpen = (text: string, id: number) => {
    setEditText(text)
    setEditId(id)
    setOpen(true)
  }
  const handleClose = () => setOpen(false)
  const [filterField, setFilterField] = useState("")
  const [filterValues, setFilterValues] = useState<string[]>([])

  type Product = (typeof Products)[number]
  type Page = (typeof Pages)[number]
  type PricePlan = (typeof PricePlans)[number]

  type DataType = Product | Page | PricePlan

  const [searchTitle, setSearchTitle] = useState<
    | (typeof SEARCH_FIELDS)[0]
    | (typeof SEARCH_FIELDS)[1]
    | (typeof SEARCH_FIELDS)[2]
  >(SEARCH_FIELDS[0])

  const [products, setProducts] = useState<DataType[]>(Products)
  const [pages, setPages] = useState<DataType[]>(Pages)
  const [pricePlans, setPricePlans] = useState<DataType[]>(PricePlans)

  const [data, setData] = useState<DataType[]>(Products)

  const uniqueValues = Array.from(
    new Set(data.map((item) => String(item[filterField as keyof typeof item])))
  )
  const [filteredData, setFilteredData] = useState<DataType[]>(data)

  const [pickedDataName, setPickedDataName] = useState(TABLE_NAMES[0])

  const [tableHeadRow, setTableHeadRow] = useState([""])

  const formatHeading = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1)
  }

  const formatDate = (input: string): string => {
    const dateRegex = /^(\d{4}-\d{2}-\d{2})T(\d{2}:\d{2}:\d{2}\.\d{1}Z)$/

    const match = input.match(dateRegex)

    if (match) {
      const [, datePart] = match
      const [year, month, day] = datePart.split("-")

      return `${day}.${month}.${year}`
    } else {
      return input
    }
  }

  const handleChangeData = (event: SelectChangeEvent) => {
    const selectedValue: (typeof TABLE_NAMES)[number] = event.target
      .value as (typeof TABLE_NAMES)[number]

    if (TABLE_NAMES.includes(selectedValue)) {
      switch (pickedDataName) {
        case TABLE_NAMES[0]:
          setProducts(data)
          break

        case TABLE_NAMES[1]:
          setPages(data)
          break
        case TABLE_NAMES[2]:
          setPricePlans(data)
          break
        default:
          setProducts(data)
      }
      setPickedDataName(selectedValue)
    }
  }

  const handleFilterField = (event: SelectChangeEvent) => {
    const filteredValue: keyof DataType = event.target.value as keyof DataType
    setFilterField(filteredValue)
  }

  const handleFilterValues = (event: SelectChangeEvent<string[]>) => {
    const {
      target: { value },
    } = event
    setFilterValues((prevValues) => {
      if (typeof value === "string") {
        return [value]
      }
      return [...prevValues, ...value]
    })
  }

  const searchField = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newText = event.target.value
    const newData = data.filter((item: DataType) =>
      String(item[searchTitle as keyof typeof item]).includes(newText)
    )
    setFilteredData(newData)
  }

  const onSave = () => {
    const newData = data.map((item: DataType) =>
      item.id === editId ? { ...item, [searchTitle]: editText } : item
    )
    setData(newData)
    handleClose()
  }

  const clearFilterValues = () => {
    setFilterValues([])
  }

  useEffect(() => {
    if (filterValues.length > 0) {
      const newData = data.filter((item: DataType) =>
        filterValues.includes(String(item[filterField as keyof typeof item]))
      )
      setFilteredData(newData)
    } else setFilteredData(data)
  }, [filterValues, filterField, data])

  useEffect(() => {
    switch (pickedDataName) {
      case TABLE_NAMES[0]:
        setSearchTitle(SEARCH_FIELDS[0])
        setData(products)
        break

      case TABLE_NAMES[1]:
        setSearchTitle(SEARCH_FIELDS[1])
        setData(pages)
        break
      case TABLE_NAMES[2]:
        setSearchTitle(SEARCH_FIELDS[2])
        setData(pricePlans)
        break
      default:
        setSearchTitle("name")
        setData(Products)
    }
  }, [pages, pickedDataName, pricePlans, products])

  useEffect(() => {
    if (data.length > 0) {
      const rows = Object.keys(data[0]).filter((item) => item !== "id")
      setTableHeadRow(rows)
    }
    setFilteredData(data)
  }, [data])

  return (
    <Box
      sx={{
        margin: "20px",
      }}
    >
      <Box
        sx={{
          display: "flex",
          width: "100%",
          justifyContent: "space-between",
          marginBottom: "10px",
        }}
      >
        <FormControl>
          <InputLabel id="custom-select-label">{CONTENT.DATA_TITLE}</InputLabel>
          <Select
            onChange={handleChangeData}
            value={pickedDataName}
            sx={{ height: "56px", width: "150px" }}
            label={CONTENT.DATA_TITLE}
          >
            {TABLE_NAMES.map((name, index) => (
              <MenuItem key={index} value={name}>
                {name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          placeholder={CONTENT.SEARCH_PLACEHOLDER + " " + searchTitle}
          onChange={searchField}
          sx={{
            "& input": {
              height: "56px",
              paddingTop: 0,
              paddingBottom: 0,
            },
          }}
        />
        <FormControl sx={{ height: "56px", width: "300px" }}>
          <InputLabel id="custom-select-label">
            {CONTENT.FILTER_FIELDS}
          </InputLabel>

          <Select
            multiple
            label={CONTENT.FILTER_FIELDS}
            value={filterValues}
            displayEmpty
            disabled={filterField === ""}
            onChange={handleFilterValues}
            sx={{ "& .MuiButtonBase-root": { width: "15px" } }}
            renderValue={(value) =>
              value ? value : <em>{CONTENT.FILTER_FIELDS}</em>
            }
            endAdornment={
              <IconButton
                onClick={clearFilterValues}
                sx={{
                  visibility: filterValues.length > 0 ? "visible" : "hidden",
                  marginRight: "15px",
                }}
              >
                <ClearIcon sx={{ width: "15px" }} />
              </IconButton>
            }
          >
            {uniqueValues.map((name, index) => (
              <MenuItem key={index} value={name}>
                {name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl>
          <InputLabel id="custom-select-label">
            {CONTENT.FILTER_TITLE}
          </InputLabel>
          <Select
            onChange={handleFilterField}
            label={CONTENT.FILTER_TITLE}
            value={filterField}
            sx={{ height: "56px", width: "200px" }}
          >
            {Object.keys(data[0]).map((name, index) => (
              <MenuItem key={index} value={name}>
                {name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      <TableContainer component={Paper}>
        <Table
          sx={{ minWidth: 650, marginTop: "20px" }}
          aria-label="simple table"
        >
          <TableHead>
            <TableRow>
              {tableHeadRow.map((item, index) => (
                <TableCell key={index}>
                  <Typography variant="h6">{formatHeading(item)}</Typography>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredData.map((row: DataType) => {
              return (
                <TableRow
                  key={row.id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  {tableHeadRow.map((field, ind) => (
                    <TableCell
                      component="th"
                      scope="row"
                      key={ind}
                      sx={
                        ind === tableHeadRow.length - 1
                          ? {
                              display: "flex",
                              justifyContent: "space-between",
                            }
                          : {}
                      }
                    >
                      <Typography variant="body1" gutterBottom>
                        {formatDate(String(row[field as keyof DataType]))}
                      </Typography>
                      {ind === tableHeadRow.length - 1 && (
                        <Button
                          variant="contained"
                          onClick={() =>
                            handleOpen(
                              String(row[searchTitle as keyof typeof row]),
                              row.id
                            )
                          }
                        >
                          {CONTENT.EDIT_BUTTON}
                        </Button>
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={open}>
          <Box sx={style}>
            <Typography variant="h6">{CONTENT.EDIT_BUTTON}</Typography>
            <Typography variant="body1">
              {formatHeading(searchTitle)}
            </Typography>

            <TextField
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
            />
            <Box sx={{ textAlign: "center" }}>
              <Button
                onClick={onSave}
                variant="contained"
                sx={{ width: "100px" }}
              >
                {CONTENT.SAVE_BUTTON}
              </Button>
            </Box>
          </Box>
        </Fade>
      </Modal>
    </Box>
  )
}
