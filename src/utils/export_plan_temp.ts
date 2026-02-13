import * as FileSystem from 'expo-file-system';
import { disableFileSystemDeprecationWarning } from 'expo-file-system/legacy'; // Just in case, but usually we import methods directly.
// Actually, let's check how to import legacy methods. The error says "import the legacy API from 'expo-file-system/legacy'".
// Inspecting the file `node_modules/expo-file-system/legacy.ts` showed it exists.
// Let's assume it re-exports the old methods.

import * as Sharing from 'expo-sharing';
import * as DocumentPicker from 'expo-document-picker';
import XLSX from 'xlsx';
import { Transaction, Debt, Reminder } from '../types';
import { formatShortDate } from './format';
import { Platform } from 'react-native';

// Import deprecated methods from legacy to suppress error
import { writeAsStringAsync, readAsStringAsync, EncodingType, cacheDirectory, StorageAccessFramework } from 'expo-file-system/legacy';

// Wait, StorageAccessFramework might NOT be in legacy?
// The error strictly mentioned `writeAsStringAsync` is deprecated.
// Let's check `legacy.ts` content if possible using `read_resource` or just `view_file`?
// I already did list_dir. I'll read `legacy.ts` to be 100% sure what it exports.
