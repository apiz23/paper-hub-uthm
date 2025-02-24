"use client";

import React, { createContext, useContext, useState } from "react";

const SearchHistoryContext = createContext<{
	searchHistory: string[];
	addSearchTerm: (term: string) => void;
	clearSearchHistory: () => void;
}>({
	searchHistory: [],
	addSearchTerm: () => {},
	clearSearchHistory: () => {},
});

export function SearchHistoryProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	const [searchHistory, setSearchHistory] = useState<string[]>(() => {
		if (typeof window !== "undefined") {
			const savedHistory = localStorage.getItem("searchHistory");
			return savedHistory ? JSON.parse(savedHistory) : [];
		}
		return [];
	});

	const addSearchTerm = (term: string) => {
		const updatedHistory = [term, ...searchHistory];
		setSearchHistory(updatedHistory);
		localStorage.setItem("searchHistory", JSON.stringify(updatedHistory));
	};

	const clearSearchHistory = () => {
		setSearchHistory([]);
		localStorage.removeItem("searchHistory");
	};

	return (
		<SearchHistoryContext.Provider
			value={{ searchHistory, addSearchTerm, clearSearchHistory }}
		>
			{children}
		</SearchHistoryContext.Provider>
	);
}

export function useSearchHistory() {
	return useContext(SearchHistoryContext);
}
