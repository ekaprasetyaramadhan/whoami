/**
 * Lucide Icons Helper Module
 * Provides automated SVG rendering for elements with data-lucide attribute
 */

import {
  createIcons,
  LayoutDashboard,
  MapPinned,
  ScanSearch,
  Bot,
  LogOut,
  Search,
  Filter,
  Play,
  Eye,
  Edit,
  Plus,
  RefreshCw,
  X,
  Shield,
  ShieldAlert,
  Globe,
  Users,
  TrendingUp,
  AlertTriangle,
  Flame,
  Clock,
  Sparkles,
  ExternalLink,
  SlidersHorizontal,
  Layers,
  ChevronRight,
  CheckCircle,
  FileText,
  Activity,
  Calendar,
  Share2
} from 'lucide';

export const availableIcons = {
  LayoutDashboard,
  MapPinned,
  ScanSearch,
  Bot,
  LogOut,
  Search,
  Filter,
  Play,
  Eye,
  Edit,
  Plus,
  RefreshCw,
  X,
  Shield,
  ShieldAlert,
  Globe,
  Users,
  TrendingUp,
  AlertTriangle,
  Flame,
  Clock,
  Sparkles,
  ExternalLink,
  SlidersHorizontal,
  Layers,
  ChevronRight,
  CheckCircle,
  FileText,
  Activity,
  Calendar,
  Share2
};

export function renderLucideIcons(rootElement = document) {
  try {
    createIcons({
      icons: availableIcons,
      nameAttr: 'data-lucide',
      attrs: {
        'stroke-width': '2'
      }
    });
  } catch (err) {
    console.warn('Gagal merender ikon Lucide:', err);
  }
}

