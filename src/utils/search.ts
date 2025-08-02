import { validateSearchTerm } from './validation';

export interface SearchHandlers {
  handleSearch: () => void;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSearchKeyPress: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

/**
 * 검색 처리를 위한 공통 핸들러 생성 함수
 * 모든 검색 컴포넌트에서 동일한 방식으로 검색 처리
 */
export const createSearchHandlers = ({
  searchTerm,
  setSearchTerm,
  onSearch,
  setIsSearching,
  showAlert,
}: {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  onSearch: (term: string) => void;
  setIsSearching?: (isSearching: boolean) => void;
  showAlert?: (message: string) => void;
}): SearchHandlers => {
  const executeSearch = () => {
    if (!searchTerm.trim()) {
      showAlert?.('검색어를 입력해주세요.');
      return;
    }

    const validatedTerm = validateSearchTerm(searchTerm);
    if (!validatedTerm) {
      showAlert?.('검색어에 특수문자를 제외한 한글, 영문, 숫자만 입력해주세요.');
      return;
    }

    if (setIsSearching) {
      setIsSearching(true);
    }
    onSearch(validatedTerm);
  };

  return {
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      const validatedValue = validateSearchTerm(value);
      setSearchTerm(validatedValue);
      
      if (setIsSearching && !validatedValue.trim()) {
        setIsSearching(false);
      }
    },

    handleSearch: executeSearch,

    handleSearchKeyPress: (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        executeSearch();
      }
    },
  };
};
