# Company Form Components

This directory contains the modular components for the Company Form, breaking down the large form into smaller, manageable pieces.

## Components

### 1. CompanyBasicInfo.tsx
- **Purpose**: Handles basic company information fields
- **Fields**: Company name, code, fiscal year, print name, domain, email, server host, accounting package, corporate identity, tax deduction, service tax, PAN, VAT, constitution type, currency, contact person, contact number
- **Props**: register, control, errors, isReadOnly, orgOptions, currencyOptions, accountingOptions

### 2. CompanyOfficeAddress.tsx
- **Purpose**: Handles registered office address information
- **Fields**: Address lines, country, state, city, pin code, telephone, fax, location
- **Props**: register, control, errors, isReadOnly, countryOptions, stateOptions, cityOptions, locationOptions, watchedCountryId, watchedStateId, watchedCityId

### 3. CompanyBillingAddress.tsx
- **Purpose**: Handles billing address information
- **Fields**: Same as office address with "same as office" checkbox functionality
- **Props**: register, control, errors, isReadOnly, countryOptions, stateOptions, cityOptions, locationOptions, watchedSameAsOfficeAddress

### 4. CompanyPayrollInfo.tsx
- **Purpose**: Handles payroll-related information
- **Fields**: TAN number, PF applicable/number, ESI applicable/number, salary calculation, days, start days
- **Props**: register, errors, isReadOnly

### 5. CompanyConfigurations.tsx
- **Purpose**: Handles various configuration checkboxes
- **Fields**: MOR selection, material selection, service selection, SOR selection
- **Props**: register, isReadOnly

### 6. CompanyGSTIN.tsx
- **Purpose**: Handles dynamic GSTIN entries
- **Fields**: State-wise GSTIN entries with state, GSTIN number, address, pin code
- **Props**: control, setValue, isReadOnly, gstinEntries, setGstinEntries, allStateOptions, addGSTINEntry, removeGSTINEntry

### 7. CompanyLogoUpload.tsx
- **Purpose**: Handles company logo upload with drag-and-drop functionality
- **Fields**: Logo file upload with preview, validation, and removal
- **Features**: 
  - Drag and drop upload
  - File validation (type: image/*, size: max 5MB)
  - Image preview with remove functionality
  - Support for existing logo display
  - Rails nested attributes integration (logo_attributes)
  - FormData handling for file uploads
- **Props**: isReadOnly, setValue, existingLogo
- **Backend Integration**: Uses `logo_attributes: [:id, :active, :document]` for Rails nested attributes

### 8. CompanyFormActions.tsx
- **Purpose**: Handles form submission buttons
- **Fields**: Cancel and Save/Submit buttons
- **Props**: mode, isSubmitting, onCancel

## Benefits of Modularization

1. **Maintainability**: Each component is focused on a specific section, making it easier to modify or debug
2. **Reusability**: Components can be reused in other forms or contexts
3. **Testability**: Individual components can be tested in isolation
4. **Performance**: Smaller components can be optimized individually
5. **Readability**: The main form file is much cleaner and easier to understand
6. **Collaboration**: Different developers can work on different components simultaneously

## Usage

```tsx
import CompanyForm from './CompanyForm';

// The main form automatically uses all the modular components
<CompanyForm
  mode="create"
  onSave={handleSave}
  onCancel={handleCancel}
/>
```

## File Structure

```
CompanyMaster/
├── CompanyForm.tsx (Main form component)
├── CompanyFormOld.tsx (Backup of original large form)
├── components/
│   ├── index.ts (Export all components)
│   ├── CompanyBasicInfo.tsx
│   ├── CompanyOfficeAddress.tsx
│   ├── CompanyBillingAddress.tsx
│   ├── CompanyPayrollInfo.tsx
│   ├── CompanyConfigurations.tsx
│   ├── CompanyGSTIN.tsx
│   └── CompanyFormActions.tsx
└── README.md (This file)
```

## Future Enhancements

- Add form validation to individual components
- Implement lazy loading for better performance
- Add component-specific loading states
- Create unit tests for each component
- Add error boundaries for better error handling
