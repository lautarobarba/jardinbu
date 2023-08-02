import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { KingdomPrivateList } from './Kingdom/KingdomPrivateList';
import { PhylumPrivateList } from './Phylum/PhylumPrivateList';
import { ClassesTaxPrivateList } from './ClassesTax/ClassesTaxPrivateList';
import { OrdersTaxPrivateList } from './OrderTax/OrdersTaxPrivateList';
import { FamiliesPrivateList } from './Families/FamiliesPrivateList';
import { GeneraPrivateList } from './Genera/GeneraPrivateList';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role='tabpanel'
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export const TaxonomyPage = () => {
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label='tabs'>
          <Tab label='Reinos' {...a11yProps(0)} />
          <Tab label='Filos' {...a11yProps(1)} />
          <Tab label='Clases' {...a11yProps(2)} />
          <Tab label='Ordenes' {...a11yProps(3)} />
          <Tab label='Familias' {...a11yProps(4)} />
          <Tab label='Géneros' {...a11yProps(5)} />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        <KingdomPrivateList />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <PhylumPrivateList />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        <ClassesTaxPrivateList />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={3}>
        <OrdersTaxPrivateList />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={4}>
        <FamiliesPrivateList />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={5}>
        <GeneraPrivateList />
      </CustomTabPanel>
    </Box>
  );
};
